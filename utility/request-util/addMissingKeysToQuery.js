/**
 * Update the query object in place so that it have
 * all the keys present in keys parameter , missing keys
 * in query object is filled with empty values
 *
 * @param {Object} query - query received in request to the api
 * @param {Object} keys  - Necessary keys that should be present in the query
 * @return {void} - modifies the query object inplace
 */
function addMissingKeysToQuery(query, keys) {
  // Semester not handled here yet , semester is a number ,
  // so missing semester can not be dealt the way
  // other query attributes are dealt here using RegExp
  for (key of keys) {
    if (!(key in query)) {
      query[key] = new RegExp('');
    }
  }
}

module.exports = addMissingKeysToQuery;
