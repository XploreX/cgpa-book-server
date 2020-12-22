const ROOT = require(__dirname + '/../../config').ROOT;
const {College} = require(ROOT + '/models/academia');
const CustomError = require(ROOT + '/CustomError');
const getDateUpdateDict = require(ROOT +
  '/services/academia/getDateUpdateDict');
const utility = require(ROOT + '/utility');
const academiaFields = require(ROOT + '/fields/academia');

/**
 *
 * @param {Object} query Given query to insert in database
 * @returns
 */
function fillMissingData(query) {
  if (typeof query['college'] !== 'string') {
    return Promise.resolve(true);
  }
  let allGood = 1;
  return College.findOne({
    college: query['college'],
  })
      .exec()
      .then((doc) => {
        if (doc === null) {
          throw new CustomError('Given college don\'t exist', 400);
        }
        return doc;
      })
      .then(() => {
        if (typeof query['course'] !== 'string') {
          return Promise.resolve(true);
        } else {
          return College.updateOne(
              {
                'college': query['college'],
                'courses.course': {$ne: query['course']},
              },
              {
                $push: {courses: {course: query['course']}},
                $currentDate: {
                  ...getDateUpdateDict(),
                  ...{[academiaFields.TS_LAST_LIST_MODIFICATION]: true},
                },
              },
          ).exec();
        }
      })
      .then((queryRes) => {
        if (typeof query['branch'] !== 'string') {
          allGood = 0;
          return Promise.resolve(queryRes);
        }
        return College.updateOne(
            {
              college: query['college'],
              courses: {
                $elemMatch: {
                  'course': query['course'],
                  'branches.branch': {$ne: query['branch']},
                },
              },
            },
            {
              $push: {
                'courses.$[i].branches': {
                  branch: query['branch'],
                  abbreviation:
              utility.stringUtil.getAbbreviation(query['branch']),
                },
              },
              $currentDate: {
                ...getDateUpdateDict('i'),
                ...{
                  ['courses.$[i].' +
              academiaFields.TS_LAST_LIST_MODIFICATION]: true,
                },
              },
            },
            {
              arrayFilters: [{'i.course': query['course']}],
            },
        ).exec();
      })
      .then((queryRes) => {
        if (
          !allGood ||
        (typeof query['semester'] !== 'string' &&
          typeof query['semester'] !== 'number')
        ) {
          return Promise.resolve(queryRes);
        }
        return College.updateOne(
            {
              college: query['college'],
              courses: {
                $elemMatch: {
                  course: query['course'],
                  branches: {
                    $elemMatch: {
                      'branch': query['branch'],
                      'semesters.semester': {$ne: query['semester']},
                    },
                  },
                },
              },
            },
            {
              $push: {
                'courses.$[i].branches.$[j].semesters': {
                  semester: query['semester'],
                },
              },
              $currentDate: {
                ...getDateUpdateDict('i', 'j'),
                ...{
                  ['courses.$[i].branches.$[j].' +
              academiaFields.TS_LAST_LIST_MODIFICATION]: true,
                },
              },
            },
            {
              arrayFilters: [
                {'i.course': query['course']},
                {'j.branch': query['branch']},
              ],
            },
        ).exec();
      });
}

module.exports = fillMissingData;
