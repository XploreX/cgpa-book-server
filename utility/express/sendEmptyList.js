const {StatusCodes} = require('http-status-codes');

function sendEmptyList(res) {
    return res.status(StatusCodes.OK).json([]);
}

module.exports = sendEmptyList;