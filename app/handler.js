'use strict';

const logger = require('../lib/logger');
const { parseLambdaInput } = require('../src/core/parseInput');
const { processEvents } = require('../src/processor');

logger.setLogLevel(process.env.LOG_LEVEL || 'INFO');

exports.handler = async (event) => {
  const parsed = parseLambdaInput(event);

  if ('error' in parsed) {
    logger.warn('Invalid Lambda input', { reason: parsed.error });
    throw new Error(parsed.error);
  }

  return processEvents(parsed.events);
};
