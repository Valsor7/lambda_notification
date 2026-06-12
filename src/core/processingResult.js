'use strict';

const STATUS = {
  PROCESSED: 'processed',
  FAILED: 'failed',
};

/**
 * @returns {{ processed: number, failed: number, results: object[] }}
 */
function createSummary() {
  return {
    processed: 0,
    failed: 0,
    results: [],
  };
}

/**
 * @param {ReturnType<typeof createSummary>} summary
 * @param {'processed'|'failed'} bucket
 * @param {Record<string, unknown>} result
 */
function recordResult(summary, bucket, result) {
  summary[bucket] += 1;
  summary.results.push(result);
}

/**
 * @param {number} index
 * @param {string} reason
 * @param {string} [type]
 */
function failed(index, reason, type) {
  return {
    index,
    status: STATUS.FAILED,
    ...(type ? { type } : {}),
    reason,
  };
}

/**
 * @param {number} index
 * @param {string} type
 * @param {number} notificationId
 * @param {Record<string, unknown>} notification
 * @param {Record<string, unknown>} normalizedEvent
 */
function processed(index, type, notificationId, notification, normalizedEvent) {
  return {
    index,
    status: STATUS.PROCESSED,
    type,
    notificationId,
    notification,
    normalizedEvent,
  };
}

module.exports = {
  STATUS,
  createSummary,
  recordResult,
  failed,
  processed,
};
