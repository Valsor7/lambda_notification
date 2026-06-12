'use strict';

const { ValidationError } = require('../core/errors');

/**
 * Normalizes roles into a trimmed array of non-empty strings.
 * Accepts comma-separated strings, arrays, or null/undefined.
 * @param {unknown} value
 * @returns {string[]}
 */
function normalizeRoles(value) {
  if (value === null || value === undefined) {
    return [];
  }

  let items = [];

  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === 'string') {
    items = value.split(',');
  } else {
    throw new ValidationError(`Invalid roles value: expected string or array, got ${typeof value}`);
  }

  return items
    .map((role) => String(role).trim())
    .filter((role) => role.length > 0);
}

module.exports = {
  normalizeRoles,
};
