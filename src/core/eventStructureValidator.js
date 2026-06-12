'use strict';

const { ValidationError } = require('../core/errors');

/**
 * Validates the structural integrity of a raw event before type-specific handling.
 */
class EventStructureValidator {
  /**
   * @param {unknown} rawEvent
   * @returns {{ type: string, event: Record<string, unknown> }}
   */
  validate(rawEvent) {
    if (!rawEvent || typeof rawEvent !== 'object' || Array.isArray(rawEvent)) {
      throw new ValidationError('Event must be a non-null object');
    }

    const event = /** @type {Record<string, unknown>} */ (rawEvent);
    const eventType = event.type;

    if (typeof eventType !== 'string' || !eventType.trim()) {
      throw new ValidationError('Missing or invalid event type');
    }

    return {
      type: eventType.trim(),
      event,
    };
  }
}

module.exports = EventStructureValidator;
