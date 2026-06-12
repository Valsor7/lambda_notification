'use strict';

const chrono = require('chrono-node');
const { ValidationError } = require('../core/errors');

/**
 * Attempts to parse a date string using chrono-node.
 * @param {string} value
 * @returns {Date|null}
 */
function parseDateValue(value) {
  return chrono.parseDate(value.trim());
}

/**
 * Converts a date-like value to ISO 8601 UTC, or throws on invalid input.
 * @param {unknown} value
 * @param {string} fieldName
 * @returns {string}
 */
function validateAndNormalizeDate(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`Missing required date field: ${fieldName}`);
  }

  const parsed = parseDateValue(String(value));
  if (!parsed) {
    throw new ValidationError(`Invalid date for ${fieldName}: "${value}"`);
  }

  return parsed.toISOString();
}

module.exports = {
  parseDateValue,
  validateAndNormalizeDate,
};
