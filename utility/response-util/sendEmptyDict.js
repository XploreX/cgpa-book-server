const {StatusCodes} = require('http-status-codes');

function sendEmptyDict(res,statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({});
}

module.exports = sendEmptyDict;