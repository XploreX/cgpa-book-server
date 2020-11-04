class CustomError extends Error {
    static get NAME_AUTHENTICATION_ERROR() {
      return 'AuthenticationError';
    }
    static get NAME_AUTHORIZATION_ERROR() {
        return 'AuthorizationError';
    }
    static get NAME_VALUE_ERROR() {
        return 'ValueError';
    }
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
  
      if(this.statusCode === 401) {
          this.name = this.constructor.NAME_AUTHENTICATION_ERROR;
      }
      if(this.statusCode === 403) {
          this.name = this.constructor.NAME_AUTHORIZATION_ERROR;
      }
      if(this.statusCode === 400) {
          this.name = this.constructor.NAME_VALUE_ERROR;
      }
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  module.exports = CustomError;
  