const {STATUS_OK} = require('../routers/academia-constants.js');

function sendEmptyDict(res) {
    return res.status(STATUS_OK).json({});
}

function sendEmptyList(res) {
    return res.status(STATUS_OK).json([]);
}

module.exports = {
    sendEmptyDict: sendEmptyDict,
    sendEmptyList: sendEmptyList
}