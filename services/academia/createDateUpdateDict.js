const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

/**
 *
 * @param {string} i - string representing index of course
 * @param {string} j - string representing index of branch
 * @return {Object} - returns dictionary required by mongo to update
 * timestamp fields
 */
function createDateUpdateDict(i, j) {
  d = {
    [academiaFields.TS_UPDATED_AT]: true,
  };
  if (typeof i === 'string') {
    d['courses.$[' + i + '].' + academiaFields.TS_UPDATED_AT] = true;
    if (typeof j === 'string') {
      d[
          'courses.$[' +
          i +
          '].branches.$[' +
          j +
          '].' +
          academiaFields.TS_UPDATED_AT
      ] = true;
    }
  }
  return d;
}

module.exports = createDateUpdateDict;
