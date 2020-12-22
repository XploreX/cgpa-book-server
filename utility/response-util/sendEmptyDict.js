const {StatusCodes} = require('http-status-codes');
/**
 * Sends empty dictionary in response
 *
 * @param {ResponseObject} res -
 * @param {Number} statusCode - status code to send
 * @return {void} -
 */
function sendEmptyDict(res, statusCode = StatusCodes.OK) {
  return res.status(statusCode).json({});
}

module.exports = sendEmptyDict;
