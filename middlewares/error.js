const { StatusCodes } = require("http-status-codes");
const { MongoError } = require("mongodb");

const ROOT = require(__dirname + "/../config").ROOT;
const utility = require(ROOT + "/utility");
const CustomError = require(ROOT + "/CustomError");

function notFoundHandler(req, res, next) {
  err = new CustomError("Content not found", 404);
  return next(err);
}

function logErrors(err, req, res, next) {
  if ("statusCode" in err) {
    if (err.statusCode === StatusCodes.NOT_MODIFIED) {
      // console.log("yeah here", err);
      return next(err);
    }
  }
  console.log(err);
  return next(err);
}

function genericErrorHandler(err, req, res, next) {
  if (!("statusCode" in err)) {
    if (err instanceof TypeError || err.name == "TypeError") {
      err.statusCode = 400;
    } else if (
      err.code == 11000 ||
      err.name == "ValidationError" ||
      err.name == "ValueError"
    ) {
      //error code 11000 is mongodb duplicate key error
      err.statusCode = 400;
    } else if (err instanceof MongoError || err.name == "MongoError") {
      err.statusCode = 500;
    } else {
      err.statusCode = 503;
      // next(err);
    }
  }
  if (err.statusCode === StatusCodes.NOT_MODIFIED) return;
  // console.log(err.statusCode,err.name,err.message);
  return res.status(err.statusCode).json(utility.responseUtil.getErrorResponse(err));
}

module.exports = {
  logErrors: logErrors,
  genericErrorHandler: genericErrorHandler,
  notFoundHandler: notFoundHandler,
};
