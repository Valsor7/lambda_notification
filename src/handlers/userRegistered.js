'use strict';

const createTypedEventHandler = require('./createTypedEventHandler');
const EventType = require('./eventTypes');
const { ValidationError } = require('../core/errors');
const { validateEmail } = require('../validators/email');
const { validateAndNormalizeDate } = require('../validators/date');
const { normalizeRoles } = require('../normalizers/roles');

module.exports = createTypedEventHandler({
  type: EventType.USER_REGISTERED,
  transform(event) {
    if (!event.name || typeof event.name !== 'string' || !event.name.trim()) {
      throw new ValidationError('Missing or invalid required field: name');
    }

    return {
      name: event.name.trim(),
      email: validateEmail(event.email),
      roles: normalizeRoles(event.roles),
      joined: validateAndNormalizeDate(event.joined, 'joined'),
    };
  },
});
