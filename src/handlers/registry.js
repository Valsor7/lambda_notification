'use strict';

const userRegistered = require('./userRegistered');
const passwordReset = require('./passwordReset');
const userDeleted = require('./userDeleted');

/**
 * Registry pattern: maps event types to handler strategies.
 * Open for extension (register new handlers) without modifying consumers.
 */
class HandlerRegistry {
  constructor(handlers = []) {
    /** @type {Map<string, { type: string, handle: Function }>} */
    this.handlers = new Map();
    handlers.forEach((handler) => this.register(handler));
  }

  /** @param {{ type: string, handle: Function }} handler */
  register(handler) {
    this.handlers.set(handler.type, handler);
  }

  /**
   * @param {string} type
   * @returns {((event: Record<string, unknown>) => Record<string, unknown>)|undefined}
   */
  getHandler(type) {
    return this.handlers.get(type)?.handle;
  }

  /** @returns {string[]} */
  getSupportedTypes() {
    return [...this.handlers.keys()];
  }

  /** @param {string} type */
  isSupported(type) {
    return this.handlers.has(type);
  }
}

const defaultRegistry = new HandlerRegistry([
  userRegistered,
  passwordReset,
  userDeleted,
]);

module.exports = {
  HandlerRegistry,
  defaultRegistry,
};
