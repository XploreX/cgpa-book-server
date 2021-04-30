const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

/**
 * Updates find query dictionary to include all query keys specified by
 * both mp and query arguments
 *
 * @param {Object} mp map of query keys to collection fields
 * @param {Object} query object containing queries
 * @param {Object} relevantQueryDict find query dictionary to update
 * @return {void}
 */
function updateQueryDict(mp, query, relevantQueryDict) {
  for (const key in mp) {
    if (!(key in query)) {
      continue;
    }
    const field = mp[key];
    const value = query[key];
    relevantQueryDict[field] = value;
  }
}

/**
 * Helper functon to determine whether mongodb find query build
 * should be terminated.
 *
 * @param {Object} mp map of query keys to collection fields
 * @param {Object} query object containing queries
 * @return {boolean} true if query build should be terminated, otherwise false
 */
function terminateQueryBuild(mp, query) {
  for (const key in mp) {
    if (key in query) {
      return false;
    }
  }
  return true;
}

const queryFieldMap = Object.freeze({
  COLLEGE: Object.freeze({
    college: academiaFields.COLLEGE,
    collegeId: academiaFields.COLLEGE_ID,
    possiblyFormerCollegeName: academiaFields.COLLEGE_NAME_HISTORY,
  }),

  COURSE: Object.freeze({
    course: academiaFields.COURSE,
    courseId: academiaFields.COURSE_ID,
    possiblyFormerCourseName: academiaFields.COURSE_NAME_HISTORY,
  }),

  BRANCH: Object.freeze({
    branch: academiaFields.BRANCH,
    branchId: academiaFields.BRANCH_ID,
    possiblyFormerBranchName: academiaFields.BRANCH_NAME_HISTORY,
  }),

  SEMESTER: Object.freeze({
    semester: academiaFields.SEMESTER,
    semesterId: academiaFields.SEMESTER_ID,
    possiblyFormerSemesterName: academiaFields.SEMESTER_NAME_HISTORY,
  }),

  SUBJECT: Object.freeze({
    subject: academiaFields.SUBJECT,
    subjectId: academiaFields.SUBJECT_ID,
    possiblyFormerSubjectName: academiaFields.SUBJECT_NAME_HISTORY,
  }),
});

/**
 * Creates mongodb find query having all queries specified in
 * the query argument.
 * Currently, following queries are supported:
 * - college, collegeId, possiblyFormerCollegeName
 * - course, courseId, possiblyFormerCourseName
 * - branch, branchId, possiblyFormerBranchName
 * - semester, semesterId, possiblyFormerSemesterName
 * - subject, subjectId, possiblyFormerSubjectName
 *
 * @param {object} query object containing queries
 * @return {object} created mongodb find query
 */
function createFindQuery(query) {
  const queryDict = {};
  let relevantQueryDict = queryDict;
  const criteria = ['college', 'course', 'branch', 'semester', 'subject'];
  for (let criterion of criteria) {
    if (criterion != 'college') {
      let field = criterion;
      if (field == 'branch') {
        field += 'e';
      }
      field += 's';
      relevantQueryDict[field] = {};
      relevantQueryDict[field]['$elemMatch'] = {};
      relevantQueryDict = relevantQueryDict[field]['$elemMatch'];
    }
    criterion = criterion.toUpperCase();
    if (terminateQueryBuild(queryFieldMap[criterion], query)) {
      return queryDict;
    }
    updateQueryDict(queryFieldMap[criterion], query, relevantQueryDict);
  }
  return queryDict;
}

module.exports = createFindQuery;
