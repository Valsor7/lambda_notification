'use strict';

const logger = require('../lib/logger');
const { defaultRegistry } = require('./handlers/registry');
const MySQLNotificationRepository = require('./repositories/MySQLNotificationRepository');
const EventProcessorService = require('./services/EventProcessorService');
const EventStructureValidator = require('./core/eventStructureValidator');

/**
 * @param {unknown[]} events
 * @returns {Promise<import('./core/processingResult').createSummary extends () => infer R ? R : never>}
 */
async function processEvents(events) {
  return new EventProcessorService({
    registry: defaultRegistry,
    repository: new MySQLNotificationRepository(),
    structureValidator: new EventStructureValidator(),
    logger,
  }).processBatch(events);
}

module.exports = { processEvents };
