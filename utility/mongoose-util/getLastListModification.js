const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

function getLastListModification() {
    return this[academiaFields.TS_LAST_LIST_MODIFICATION].toUTCString();
}

module.exports = getLastListModification;