const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || 'logs/combined.log';

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

module.exports = logger; 