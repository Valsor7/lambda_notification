'use strict';

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let currentLevel = LEVELS.INFO;

/**
 * Configure the minimum log level for the application.
 * @param {string} level - One of DEBUG, INFO, WARN, ERROR
 */
function setLogLevel(level) {
  const normalized = String(level || 'INFO').toUpperCase();
  if (LEVELS[normalized] === undefined) {
    throw new Error(`Invalid log level: ${level}`);
  }
  currentLevel = LEVELS[normalized];
}

function shouldLog(level) {
  return LEVELS[level] >= currentLevel;
}

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level}] ${message}`;
  if (meta === undefined) {
    return base;
  }
  return `${base} ${JSON.stringify(meta)}`;
}

function log(level, message, meta) {
  if (!shouldLog(level)) {
    return;
  }

  const output = formatMessage(level, message, meta);
  if (level === 'ERROR') {
    console.error(output);
  } else if (level === 'WARN') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

module.exports = {
  setLogLevel,
  debug: (message, meta) => log('DEBUG', message, meta),
  info: (message, meta) => log('INFO', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  error: (message, meta) => log('ERROR', message, meta),
};
