'use strict';

const createTypedEventHandler = require('./createTypedEventHandler');
const EventType = require('./eventTypes');
const { validateEmail } = require('../validators/email');
const { validateAndNormalizeDate } = require('../validators/date');

module.exports = createTypedEventHandler({
  type: EventType.USER_DELETED,
  transform(event) {
    return {
      email: validateEmail(event.email),
      deleted: validateAndNormalizeDate(event.deleted, 'deleted'),
    };
  },
});
