const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const {College, CollegeHeader} = require(ROOT + '/models').academia;
const academiaService = require(ROOT + '/services/academia');
// eslint-disable-next-line new-cap
const router = express.Router();

const checkList = ['college'];

router.post('/college', (req, res, next) => {
  const query = req.body;
  utility.requestUtil.ensureCertainFields(query, checkList);
  academiaService.addIdFields(query['college']);
  academiaService.updateHistoryFields(query['college']);
  college = new College(query['college']);
  college
      .save()
      .then((doc) => {
        return CollegeHeader.updateLastListModification();
      })
      .then(() => {
        res.sendStatus(StatusCodes.OK);
      })
      .catch(next);
});

router.get('/college', (req, res, next) => {
  const query = req.query;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne(academiaService.createFindQuery(query))
      .exec()
      .then((college) => {
        if (!college) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        utility.expressUtil.handleIfModifiedSince(
            req,
            res,
            college.getLastModified(),
        );
        res.append(
            utility.httpUtil.headers.LAST_MODIFIED,
            college.getLastModified(),
        );
        res.status(StatusCodes.OK).json(college);
      })
      .catch(next);
});

router.get('/college-list', (req, res, next) => {
  const query = req.query;
  utility.requestUtil.addMissingKeysToQuery(query, [
    'college',
    'course',
    'branch',
  ]);
  utility.requestUtil.ensureCertainFields(query, checkList);
  const collegeList = [];
  CollegeHeader.getLastListModification()
      .then((lastListModification) => {
        utility.expressUtil.handleIfModifiedSince(
            req,
            res,
            lastListModification,
        );
        res.set(utility.httpUtil.headers.LAST_MODIFIED, lastListModification);
        return College.find({college: query['college']})
            .select('college abbreviation')
            .exec();
      })
      .then((colleges) => {
        for (college of colleges) {
          collegeName = college.college;
          if (college['abbreviation']) {
            collegeName += ' ( ' + college.abbreviation + ' ) ';
          }
          collegeList.push(collegeName);
        }
        return res.status(StatusCodes.OK).json(collegeList);
      })
      .catch(next);
});

module.exports = router;
