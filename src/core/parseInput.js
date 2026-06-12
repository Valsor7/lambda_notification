'use strict';

/**
 * Parses a Lambda event payload into an array of notification events.
 *
 * @param {unknown} event
 * @returns {{ events: unknown[] } | { error: string }}
 */
function parseLambdaInput(event) {
  if (Array.isArray(event)) {
    return { events: event };
  }

  if (!event || typeof event !== 'object') {
    return { error: 'Invalid input: expected a JSON array of event objects' };
  }

  const payload = /** @type {Record<string, unknown>} */ (event);

  if (Array.isArray(payload.events)) {
    return { events: payload.events };
  }

  if (typeof payload.body === 'string') {
    let parsedBody;
    try {
      parsedBody = JSON.parse(payload.body);
    } catch {
      return { error: 'Invalid input: API Gateway body is not valid JSON' };
    }
    return parseLambdaInput(parsedBody);
  }

  if (Array.isArray(payload.body)) {
    return { events: payload.body };
  }

  return { error: 'Invalid input: expected a JSON array of event objects' };
}

module.exports = {
  parseLambdaInput,
};
