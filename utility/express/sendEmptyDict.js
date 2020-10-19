const {StatusCodes} = require('http-status-codes');

function sendEmptyDict(res) {
    return res.status(StatusCodes.OK).json({});
}

module.exports = sendEmptyDict;