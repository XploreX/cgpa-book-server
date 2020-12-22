const ROOT = require(__dirname + '/../../config').ROOT;
const CustomError = require(ROOT + '/CustomError');

/**
 *
 * @param {Object} query  - query received in request to the api
 * @param {List} keys - list of keys that absolutely have to
 * be present in the query
 * @throws {Error} - throws error if some key present is keys is not present
 * in query object
 */
function ensureCertainFields(query, keys) {
  for (key of keys) {
    if (!(key in query)) {
      const err = new CustomError(
          'Required \'' + key + '\' attribute not present in query',
          400,
      );
      throw err;
    }
  }
}

module.exports = ensureCertainFields;
