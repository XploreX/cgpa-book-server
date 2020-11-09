const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

function getLastModified(inUTCStringForm = true) {
    if(inUTCStringForm)
        return this[academiaFields.TS_UPDATED_AT].toUTCString();
    else
        return this[academiaFields.TS_UPDATED_AT];
}

module.exports = getLastModified;