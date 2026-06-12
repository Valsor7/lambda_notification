'use strict';

const EventType = require('./eventTypes');

/**
 * Factory for typed event handlers (Template Method + Strategy).
 *
 * @param {object} config
 * @param {EventType[keyof EventType]} config.type
 * @param {(event: Record<string, unknown>) => Record<string, unknown>} config.transform
 * @returns {{ type: string, handle: (event: Record<string, unknown>) => Record<string, unknown> }}
 */
function createTypedEventHandler({ type, transform }) {
  if (!type || typeof transform !== 'function') {
    throw new Error('createTypedEventHandler requires type and transform');
  }

  if (!Object.values(EventType).includes(type)) {
    throw new Error(`createTypedEventHandler: unknown type "${type}"`);
  }

  return {
    type,
    handle(rawEvent) {
      const normalized = { type, ...transform(rawEvent) };

      if (rawEvent.event_id) {
        normalized.event_id = String(rawEvent.event_id);
      }

      return normalized;
    },
  };
}

module.exports = createTypedEventHandler;
