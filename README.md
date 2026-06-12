# Notification Handler AWS Lambda

Node.js AWS Lambda function that validates, normalizes, and stores semi-structured notification events. The project includes a local runner for development and testing.

## Features

- **Extensible event handling** via a handler registry (`user_registered`, `password_reset`, `user_deleted`)
- **Data validation** for email addresses and date fields
- **Data normalization**
  - `roles` converted to a trimmed array of strings
  - dates converted to ISO 8601 UTC via `chrono-node`
- **Resilient batch processing** — invalid events are logged and skipped; valid events continue processing
- **Simulated MySQL persistence** via `MySQLNotificationRepository` into a `Notification`-shaped row

## Project Structure

```
.
├── app/
│   ├── handler.js              # AWS Lambda entry point
│   └── run.js                  # Local CLI runner (invokes handler.js)
├── lib/
│   ├── logger.js               # Configurable logging utility
│   └── parseArgs.js            # Shared CLI argument parser
├── sample/
│   └── events.json             # Sample input events
├── src/
│   ├── processor.js            # Public facade for batch processing
│   ├── core/
│   │   ├── errors.js                   # Domain-specific error types
│   │   ├── eventStructureValidator.js
│   │   ├── parseInput.js               # Lambda input shape parser
│   │   └── processingResult.js         # Result/summary builders
│   ├── handlers/
│   │   ├── createTypedEventHandler.js  # Handler factory
│   │   ├── eventTypes.js
│   │   ├── registry.js                 # Strategy registry
│   │   ├── userRegistered.js
│   │   ├── passwordReset.js
│   │   └── userDeleted.js
│   ├── normalizers/
│   │   └── roles.js
│   ├── repositories/
│   │   ├── constants.js
│   │   └── MySQLNotificationRepository.js
│   ├── services/
│   │   └── EventProcessorService.js    # Batch orchestration
│   └── validators/
│       ├── date.js
│       └── email.js
├── package.json
└── README.md
```

## Requirements

- Node.js 24 or later

## Setup

```bash
npm install
```

## Local Execution

```bash
node app/run.js --input sample/events.json --log-level INFO
```

Supported log levels: `DEBUG`, `INFO`, `WARN`, `ERROR` (via `--log-level` or `LOG_LEVEL` env var).

```bash
npm start
```

## Solution Overview

### Processing Flow

```
run.js  →  handler.js  →  EventProcessorService
                           ├── EventStructureValidator
                           ├── HandlerRegistry (Strategy)
                           └── MySQLNotificationRepository
```

1. `app/run.js` reads input and invokes `app/handler.js`.
2. The handler parses the payload and delegates to `processEvents()`.
3. `EventProcessorService` orchestrates each event through validation, transformation, and persistence.

### Adding a New Event Type

1. Create a handler in `src/handlers/`:

```javascript
'use strict';

const createTypedEventHandler = require('./createTypedEventHandler');
const { validateEmail } = require('../validators/email');
const { validateAndNormalizeDate } = require('../validators/date');

module.exports = createTypedEventHandler({
  type: 'account_locked',
  transform(event) {
    return {
      email: validateEmail(event.email),
      lockedAt: validateAndNormalizeDate(event.locked_at, 'locked_at'),
    };
  },
});
```

2. Register it in `src/handlers/registry.js`:

```javascript
const accountLocked = require('./accountLocked');

const defaultRegistry = new HandlerRegistry([
  userRegistered,
  passwordReset,
  userDeleted,
  accountLocked,
]);
```
