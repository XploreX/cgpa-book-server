const {StatusCodes} = require('http-status-codes');
/**
 * sends empty list in response
 *
 * @param {ResponseObject} res -
 * @param {Number} statusCode  - status code to send
 * @return {void} -
 */
function sendEmptyList(res, statusCode = StatusCodes.OK) {
  return res.status(statusCode).json([]);
}

module.exports = sendEmptyList;
