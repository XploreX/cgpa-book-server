const config = require(__dirname+'/../../config.js');
const ROOT = config.ROOT;
const updateValuesToRegExp = require(ROOT+'/utility/dictionary-util/updateValuesToRegExp.js');

function updateValuesToIgnorecase(data) {
    updateValuesToRegExp(data,'i');
}

module.exports = updateValuesToIgnorecase;