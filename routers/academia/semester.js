const express = require('express');
const {College} = require('../../models/index.js');
const academiaConsts = require('../academia-constants.js');
const mongoHelpers = require('../../utility/mongo-helpers.js');
const {sendEmptyList,sendEmptyDict} = require('../../utility/express-helpers.js');
let router = express.Router();

let checkList = ['college','course','branch','semester'];

router.post('/semester', (req, res, next) => {
    let query = req.body;
    mongoHelpers.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            mongoHelpers.checkExistance(college,'college');
            let course = college.getCourse(query['course']);
            if (!course) {
                college.addToList({ 'course': query['course'] });
                course = college.getCourse(query['course']);
            }
            let branch = course.getBranch(query['branch']);
            if (!branch) {
                course.addToList({ 'branch': query['branch'] });
                branch = course.getBranch(query['branch']);
            }
            branch.addToList(query['semester']);
            // mongoHelpers.updateLastModifed([college, course, branch, branch.getSemester(query['semester']['semester'])]);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(academiaConsts.STATUS_OK);
        })
        .catch(next);
})

router.get('/semester', (req, res, next) => {
    let query = req.body;
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
            res.append(academiaConsts.LAST_MODIFIED_HEADER, semester.lastModified);
            res.status(academiaConsts.STATUS_OK).json(semester);
        })
        .catch(next);
})

router.get('/semester-list', (req, res, next) => {
    let query = req.body;
    mongoHelpers.addMissingKeysToQuery(query,['semester']);
    mongoHelpers.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if(!college) {
                return sendEmptyList(res);
            }
            let course = college.getCourse(query['course']);
            if(!course) {
                return sendEmptyList(res);
            }
            let branch = course.getBranch(query['branch']);
            if(!branch) {
                return sendEmptyList(res);
            }
            let semesterList = [];
            for (semester of branch.semesters) {
                semesterList.push(semester.semester);
            }
            res.append(academiaConsts.LAST_MODIFIED_HEADER,branch.lastListModification.toUTCString());
            res.status(academiaConsts.STATUS_OK).json(semesterList);
        })
        .catch(next);
})

module.exports = router;