const config = require(__dirname+'/../../config.js');
const __ROOT = config.__ROOT;
const updateValuesToRegExp = require(__ROOT+'/utility/dictionary/updateValuesToRegExp.js');

function updateValuesToIgnorecase(data) {
    updateValuesToRegExp(data,'i');
}

module.exports = updateValuesToIgnorecase;