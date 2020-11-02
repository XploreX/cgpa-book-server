const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

function ensureExistence(obj,key) {
    if(! obj) {
        let err= new CustomError(key + " not found",400);
        throw err;
    }
}

module.exports = ensureExistence;