const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

function getLastModified() {
    return this[academiaFields.TS_UPDATED_AT];
}

module.exports = getLastModified;