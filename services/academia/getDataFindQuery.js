/**
 * return dictionary object needed by mongodb find queries to
 * get college data as per given conditions
 * @param {Object} query
 * @return {Object}
 */
function getDataFindQuery(query) {
  const queryDict = {};
  if (query['college']) {
    queryDict['college'] = query['college'];
  }

  if (query['course']) {
    queryDict['courses'] = {
      $elemMatch: {
        course: query['course'],
      },
    };
  }

  if (query['branch']) {
    queryDict['courses']['$elemMatch']['branches'] = {
      $elemMatch: {
        branch: query['branch'],
      },
    };
  }

  if (query['semester']) {
    queryDict['courses']['$elemMatch']['branches']['$elemMatch'][
        'semesters'
    ] = {
      $elemMatch: {
        semester: query['semester'],
      },
    };
  }
  return queryDict;
}

module.exports = getDataFindQuery;
