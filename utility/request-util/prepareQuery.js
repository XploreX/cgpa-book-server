/**
 * Modifies the values of query object suitable to the format
 * needed by the program
 *
 * @param {Object} query - query received in request to the api
 * @return {void} - modifies the query object inplace
 */
function prepareQuery(query) {
  let flags = '';
  if ('ignorecase' in query) {
    if (query['ignorecase'].toLowerCase() == 'true') {
      flags += 'i';
      query['ignorecase'] = true;
    } else {
      query['ignorecase'] = false;
    }
  }
  for (key in query) {
    if (typeof query[key] === 'string' && key!='semester') {
      query[key] = query[key].replace('(', '\\(');
      query[key] = query[key].replace(')', '\\)');
      query[key] = new RegExp(query[key], flags);
    }
  }
}

module.exports = prepareQuery;
