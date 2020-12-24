/**
 * return dictionary object needed by mongodb find queries to
 * get college data as per given conditions
 * @param {Object} query
 * @return {Object}
 */
function getFindQuery(query) {
  const matchEverything = /.*/;
  return {
    college: query['college'] || matchEverything,
    courses: {
      $elemMatch: {
        course: query['course'] || matchEverything,
        branches: {
          $elemMatch: {
            branch: query['branch'] || matchEverything,
          },
        },
      },
    },
  };
}

module.exports = getFindQuery
;
