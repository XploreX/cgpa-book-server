/**
 *
 * @param {Array} haystack
 * @param {String} needle
 * @param {String} key
 * @param {bool} ignorecase
 * @return {Object}
 */
function findNeedle(haystack, needle, key = null, ignorecase = false) {
  if (ignorecase) {
    needle = needle.toLowerCase();
  }
  for (const hay of haystack) {
    let hayValue = hay;
    if (key) {
      hayValue = hay[key];
    }
    if (ignorecase) {
      hayValue = hayValue.toLowerCase();
    }
    if (hayValue === needle) {
      return hay;
    }
  }
  return null;
}

module.exports = findNeedle;
