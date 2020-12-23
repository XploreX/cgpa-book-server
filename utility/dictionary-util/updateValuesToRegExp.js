/**
 * Modifies object inplace such that all it's
 * string values are converted to RegExp with given
 * flags enabled
 * @param {Objects} data - Object to modify
 * @param {String} flags - RegExp flags to enable
 */
function updateValuesToRegExp(data, flags) {
  for (key in data) {
    if (typeof data[key] === 'string') {
      data[key] = new RegExp(data[key], flags);
    }
  }
}

module.exports = updateValuesToRegExp;
