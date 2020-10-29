const config = require(__dirname+'/../../config');
const ROOT = config.ROOT;
const updateValuesToRegExp = require(ROOT+'/utility/dictionary-util/updateValuesToRegExp');

function updateValuesToIgnorecase(data) {
    updateValuesToRegExp(data,'i');
}

module.exports = updateValuesToIgnorecase;