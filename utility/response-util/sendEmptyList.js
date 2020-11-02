const {StatusCodes} = require('http-status-codes');

function sendEmptyList(res,statusCode = StatusCodes.OK) {
    return res.status(statusCode).json([]);
}

module.exports = sendEmptyList;