const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

function ensureCertainFields(query,keys) {
    for( key of keys) {
        if(!(key in query)) {
            let err = new CustomError("Required '" + key +"' attribute not present in query",400);
            throw err;
        }
    }
}

module.exports = ensureCertainFields;