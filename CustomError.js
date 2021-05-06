const {getReasonPhrase} = require('http-status-codes');

// eslint-disable-next-line require-jsdoc
class CustomError extends Error {
  // eslint-disable-next-line require-jsdoc
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    if (getReasonPhrase(statusCode)) {
      this.name = getReasonPhrase(statusCode);
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = CustomError;
