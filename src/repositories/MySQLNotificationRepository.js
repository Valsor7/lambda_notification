'use strict';

const logger = require('../../lib/logger');
const { NOTIFICATION_STATUS, CREATED_BY_TYPE } = require('./constants');

let nextNotificationId = 1000;

/** @param {Date} date @returns {string} */
function toMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

class MySQLNotificationRepository {
  /** @param {Record<string, unknown>} event @returns {Record<string, unknown>} */
  mapEventToRow(event) {
    const notificationId = nextNotificationId++;

    return {
      NotificationID: notificationId,
      Created: toMySQLDateTime(new Date()),
      Status: NOTIFICATION_STATUS.INBOX,
      NotificationData: event,
      CreatedByType: CREATED_BY_TYPE.SYSTEM,
      CreatedByID: 0,
      Seen: 0,
      IsBookmarked: 0,
    };
  }

  /**
   * Simulates INSERT INTO Notification (...).
   * @param {Record<string, unknown>} event
   * @returns {Promise<Record<string, unknown>>}
   */
  async insert(event) {
    const row = this.mapEventToRow(event);

    logger.debug('Simulated MySQL insert into Notification', {
      sql: 'INSERT INTO Notification (Status, NotificationData, CreatedByType, CreatedByID, Seen, IsBookmarked) VALUES (?, ?, ?, ?, ?, ?)',
      params: [row.Status, row.NotificationData, row.CreatedByType, row.CreatedByID, row.Seen, row.IsBookmarked],
      row,
    });

    return row;
  }
}

module.exports = MySQLNotificationRepository;
