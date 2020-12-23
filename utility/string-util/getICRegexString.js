/**
 *
 * @param {String} str -
 * @return {RegExp} - Regular expression form with ignorecase flag
 * enabled
 */
function getICRegexString(str) {
  return new RegExp(str, 'i');
}

module.exports - getICRegexString;
