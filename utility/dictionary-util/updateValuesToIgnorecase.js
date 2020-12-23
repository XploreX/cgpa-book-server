const config = require(__dirname + '/../../config');
const ROOT = config.ROOT;
const updateValuesToRegExp = require(ROOT +
  '/utility/dictionary-util/updateValuesToRegExp');
/**
 * Modified object inplace such that
 * all keys have string values are converted to
 * Regular expression with ignore case flag enabled
 * @param {Object} data
 */
function updateValuesToIgnorecase(data) {
  updateValuesToRegExp(data, 'i');
}

module.exports = updateValuesToIgnorecase;
