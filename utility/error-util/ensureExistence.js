const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

/**
 *
 * @param {Object} obj
 * @param {String} key
 * @throws - if key isnt present in object
 */
function ensureExistence(obj, key) {
  if (!obj) {
    const err = new CustomError(key + ' not found', 400);
    throw err;
  }
}

module.exports = ensureExistence;
