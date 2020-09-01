const express = require('express');
const {College} = require('../../models/index.js');
const mongoHelpers = require('../../utility/mongo-helpers.js');
const {sendEmptyList,sendEmptyDict} = require('../../utility/express-helpers.js');
const httpConsts = require('../../utility/http-helpers.js');
let router = express.Router();

let checkList = ['college','course','branch','semester','subject'];

router.get('/subject', (req, res, next) => {
    let query = req.query;
    mongoHelpers.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if(!college) {
                return sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if(!course) {
                return sendEmptyDict(res);
            }
            let branch = course.getBranch(query['branch']);
            if(!branch) {
                return sendEmptyDict(res);
            }
            let semester = branch.getSemester(query['semester']);
            if(!semester) {
                return sendEmptyDict(res);
            }
            let subject = semester.getSubject(query['subject']);
            if(!subject) {
                return sendEmptyDict(res);
            }
            res.status(httpConsts.STATUS_OK).json(subject);
        })
        .catch(next);
})

module.exports = router;