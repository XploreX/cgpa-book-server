const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

function getLastListModification(inUTCStringForm = true) {
    if(inUTCStringForm)
        return this[academiaFields.TS_LAST_LIST_MODIFICATION].toUTCString();
    else
        return this[academiaFields.TS_LAST_LIST_MODIFICATION];
}

module.exports = getLastListModification;