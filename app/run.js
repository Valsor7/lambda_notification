'use strict';

const fs = require('fs');
const path = require('path');

const logger = require('../lib/logger');
const parseArgs = require('../lib/parseArgs');
const { handler } = require('./handler');

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    logger.error('Usage: node app/run.js --input <file> [--log-level LEVEL]');
    process.exitCode = 1;
    return;
  }

  if (args['log-level']) {
    process.env.LOG_LEVEL = args['log-level'].toUpperCase();
  }

  const inputPath = path.resolve(process.cwd(), args.input);

  let rawContent;
  try {
    rawContent = fs.readFileSync(inputPath, 'utf8');
  } catch (error) {
    logger.error('Unable to read input file', { inputPath, reason: error.message });
    process.exitCode = 1;
    return;
  }

  let lambdaEvent;
  try {
    lambdaEvent = JSON.parse(rawContent);
  } catch (error) {
    logger.error('Invalid JSON input', { inputPath, reason: error.message });
    process.exitCode = 1;
    return;
  }

  await handler(lambdaEvent);
}

main().catch((error) => {
  logger.error('Unhandled runner error', { reason: error.message });
  process.exitCode = 1;
});
