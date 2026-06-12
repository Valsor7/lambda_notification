'use strict';

const { ValidationError } = require('../core/errors');

// Practical RFC 5322-inspired pattern for common email addresses.
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates that a value is a syntactically correct email address.
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  return EMAIL_PATTERN.test(trimmed);
}

/**
 * Validates email and returns the trimmed value, or throws.
 * @param {unknown} value
 * @param {string} fieldName
 * @returns {string}
 */
function validateEmail(value, fieldName = 'email') {
  if (!isValidEmail(value)) {
    throw new ValidationError(`Invalid ${fieldName}: "${value}"`);
  }
  return String(value).trim();
}

module.exports = {
  isValidEmail,
  validateEmail,
};
