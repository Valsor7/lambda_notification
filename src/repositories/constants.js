'use strict';

/** Notification.Status column values. */
const NOTIFICATION_STATUS = {
  INBOX: 0,
  ARCHIVED: 1,
  DELETED: 2,
};

/** CreatedByType values for the actor that produced the notification. */
const CREATED_BY_TYPE = {
  SYSTEM: 1,
};

module.exports = {
  NOTIFICATION_STATUS,
  CREATED_BY_TYPE,
};
