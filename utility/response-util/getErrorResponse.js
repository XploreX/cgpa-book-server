const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

function getErrorResponse(err)
{
    let mp = {};
    mp.error = {};
    mp.error.type = err.name;
    mp.error.message = err.message;
    return mp;
}

module.exports = getErrorResponse;