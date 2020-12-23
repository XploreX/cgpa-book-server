/**
 *
 * @param {String} str  -
 * @return {String} - returns given string with first letter capitalized
 */
function capitalizeFirstLetter(str) {
  if (str.length == 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

module.exports = capitalizeFirstLetter;
