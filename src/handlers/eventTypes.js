'use strict';

/** @enum {string} */
const EventType = Object.freeze({
  USER_REGISTERED: 'user_registered',
  PASSWORD_RESET: 'password_reset',
  USER_DELETED: 'user_deleted',
});

module.exports = EventType;
