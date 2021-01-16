const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const {College} = require(ROOT + '/models').academia;
// eslint-disable-next-line new-cap
const router = express.Router();

const checkList = ['college', 'course', 'branch', 'semester', 'subject'];

router.get('/subject', (req, res, next) => {
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
        const branch = course.getBranch(query['branch']);
        if (!branch) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        const semester = branch.getSemester(query['semester']);
        if (!semester) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        const subject = semester.getSubject(query['subject']);
        if (!subject) {
          return utility.responseUtil.sendEmptyDict(res);
        }
        res.status(StatusCodes.OK).json(subject);
      })
      .catch(next);
});

module.exports = router;
