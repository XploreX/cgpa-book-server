const express = require('express');
const {StatusCodes} = require('http-status-codes');

const __ROOT = require('/../../config.js');
const utility = require(__ROOT+'utility');
const {College} = require(__ROOT+'/models');
let router = express.Router();

let checkList = ['college','course','branch','semester','subject'];

router.get('/subject', (req, res, next) => {
    let query = req.query;
    utility.mongooseUtil.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if(!college) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if(!course) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let branch = course.getBranch(query['branch']);
            if(!branch) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let semester = branch.getSemester(query['semester']);
            if(!semester) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let subject = semester.getSubject(query['subject']);
            if(!subject) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            res.status(StatusCodes.OK).json(subject);
        })
        .catch(next);
})

module.exports = router;