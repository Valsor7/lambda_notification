'use strict';

class AppError extends Error {
  /**
   * @param {string} message
   * @param {string} [code]
   */
  constructor(message, code = 'APP_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

class ValidationError extends AppError {
  /** @param {string} message */
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
  }
}

class UnsupportedEventTypeError extends AppError {
  /**
   * @param {string} type
   * @param {string[]} supportedTypes
   */
  constructor(type, supportedTypes) {
    super(`Unsupported event type: ${type}`, 'UNSUPPORTED_EVENT_TYPE');
    this.type = type;
    this.supportedTypes = supportedTypes;
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnsupportedEventTypeError,
};
