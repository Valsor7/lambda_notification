'use strict';

const createTypedEventHandler = require('./createTypedEventHandler');
const { validateEmail } = require('../validators/email');
const { validateAndNormalizeDate } = require('../validators/date');

module.exports = createTypedEventHandler({
  type: 'password_reset',
  transform(event) {
    return {
      email: validateEmail(event.email),
      requested: validateAndNormalizeDate(event.requested, 'requested'),
    };
  },
});
