const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const {College} = require(ROOT + '/models').academia;
const academiaServices = require(ROOT + '/services/academia');
const academiaFields = require(ROOT + '/fields/academia');

// eslint-disable-next-line new-cap
const router = express.Router();

const checkList = ['college', 'course'];

router.post('/course', (req, res, next) => {
  const query = req.body;
  utility.requestUtil.ensureCertainFields(query, checkList);
  academiaServices
      .fillMissingData(query)
      .then(() => {
        return College.updateOne(
            {
              'college': query['college'],
              'courses.course': {$ne: query['course']['course']},
            },
            {
              $push: {courses: query['course']},
              $currentDate: {
                ...academiaServices.getDateUpdateDict(),
                ...{[academiaFields.TS_LAST_LIST_MODIFICATION]: true},
              },
            },
        ).exec();
      })
      .then(academiaServices.checkDataFill)
      .then((doc) => {
        res.sendStatus(StatusCodes.OK);
      })
      .catch(next);
});

router.get('/course', (req, res, next) => {
  const query = req.query;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({college: query['college']})
      .exec()
      .then((college) => {
        if (!college) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        const course = college.getCourse(query['course']);
        if (!course) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        utility.expressUtil.handleIfModifiedSince(
            req,
            res,
            course.getLastModified(),
        );
        res.append(
            utility.httpUtil.headers.LAST_MODIFIED,
            course.getLastModified(),
        );
        res.status(StatusCodes.OK).json(course);
      })
      .catch(next);
});

router.get('/course-list', (req, res, next) => {
  const query = req.query;
  utility.requestUtil.addMissingKeysToQuery(query, ['course', 'branch']);
  utility.requestUtil.ensureCertainFields(query, checkList);
  const courseList = [];

  College.findOne({college: query['college']})
      .exec()
      .then((college) => {
        if (!college) {
          return utility.responseUtil.sendEmptyList(res);
        }
        utility.expressUtil.handleIfModifiedSince(
            req,
            res,
            college.getLastListModification(),
        );
        res.set(
            utility.httpUtil.headers.LAST_MODIFIED,
            college.getLastListModification(),
        );
        for (course of college.courses) {
          if (!course.course.match(query['course'])) continue;
          const branch = course.getBranch(query['branch']);
          if (!branch && !''.match(query['branch'])) continue;
          let courseName = course.course;
          if (course.abbreviation) {
            courseName += ' (' + course.abbreviation + ')';
          }
          courseList.push(courseName);
        }
        res.status(StatusCodes.OK).json(courseList);
      })
      .catch(next);
});

module.exports = router;
