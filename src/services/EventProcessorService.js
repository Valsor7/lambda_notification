'use strict';

const { ValidationError, UnsupportedEventTypeError } = require('../core/errors');
const {
  createSummary,
  recordResult,
  failed,
  processed,
} = require('../core/processingResult');

/**
 * Orchestrates batch event processing (Single Responsibility).
 * Depends on abstractions injected via constructor (Dependency Inversion).
 */
class EventProcessorService {
  /**
   * @param {object} dependencies
   * @param {import('../handlers/registry').HandlerRegistry} dependencies.registry
   * @param {import('../repositories/MySQLNotificationRepository')} dependencies.repository
   * @param {import('../validation/eventStructureValidator')} dependencies.structureValidator
   * @param {{ info: Function, warn: Function, error: Function }} dependencies.logger
   */
  constructor({ registry, repository, structureValidator, logger }) {
    this.registry = registry;
    this.repository = repository;
    this.structureValidator = structureValidator;
    this.logger = logger;
  }

  /**
   * @param {unknown[]} events
   * @returns {Promise<ReturnType<typeof createSummary>>}
   */
  async processBatch(events) {
    if (!Array.isArray(events)) {
      throw new Error('Input must be a JSON array of event objects');
    }

    const summary = createSummary();

    this.logger.info('Starting event batch processing', {
      totalEvents: events.length,
      supportedTypes: this.registry.getSupportedTypes(),
    });

    for (let index = 0; index < events.length; index += 1) {
      await this.processOne(events[index], index, summary);
    }

    this.logger.info('Batch processing complete', {
      processed: summary.processed,
      failed: summary.failed,
    });

    return summary;
  }

  /**
   * @param {unknown} rawEvent
   * @param {number} index
   * @param {ReturnType<typeof createSummary>} summary
   */
  async processOne(rawEvent, index, summary) {
    let eventType;

    try {
      const validated = this.structureValidator.validate(rawEvent);
      eventType = validated.type;
      rawEvent = validated.event;
    } catch (error) {
      return this.handleFailure(summary, index, error, rawEvent);
    }

    if (!this.registry.isSupported(eventType)) {
      return this.handleFailure(
        summary,
        index,
        new UnsupportedEventTypeError(eventType, this.registry.getSupportedTypes()),
        rawEvent,
        eventType,
      );
    }

    const handler = this.registry.getHandler(eventType);

    try {
      const normalizedEvent = handler(rawEvent);
      const notification = await this.repository.insert(normalizedEvent);

      this.logger.info('Event processed successfully', {
        index,
        type: eventType,
        notificationId: notification.NotificationID,
        normalizedEvent,
      });

      recordResult(
        summary,
        'processed',
        processed(
          index,
          eventType,
          notification.NotificationID,
          notification,
          normalizedEvent,
        ),
      );
    } catch (error) {
      this.handleFailure(summary, index, error, rawEvent, eventType);
    }
  }

  /**
   * @param {ReturnType<typeof createSummary>} summary
   * @param {number} index
   * @param {unknown} error
   * @param {unknown} rawEvent
   * @param {string} [eventType]
   */
  handleFailure(summary, index, error, rawEvent, eventType) {
    const reason = error instanceof Error ? error.message : String(error);

    if (error instanceof UnsupportedEventTypeError) {
      this.logger.error('Unsupported event type', {
        index,
        type: error.type,
        supportedTypes: error.supportedTypes,
      });
    } else if (error instanceof ValidationError) {
      this.logger.error('Invalid event entry', { index, reason, rawEvent });
    } else {
      this.logger.error('Event validation or transformation failed', {
        index,
        type: eventType,
        reason,
        rawEvent,
      });
    }

    recordResult(summary, 'failed', failed(index, reason, eventType));
  }
}

module.exports = EventProcessorService;
