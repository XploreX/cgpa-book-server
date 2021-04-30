const ROOT = require(__dirname + '/../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

module.exports = Object.freeze({
  COLLEGE_ID: 'collegeId',
  COURSE_ID: academiaFields.COURSE_ID,
  BRANCH_ID: academiaFields.BRANCH_ID,
  SEMESTER_ID: academiaFields.SEMESTER_ID,
});
