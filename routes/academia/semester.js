const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config.js').ROOT;
const utility = require(ROOT+'/utility');
const {College} = require(ROOT+'/models').academia;

let router = express.Router();

let checkList = ['college','course','branch','semester'];

router.post('/semester', (req, res, next) => {
    let query = req.body;
    utility.requestUtil.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            utility.mongooseUtil.checkExistence(college,'college');
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
            let semester = branch.getSemester(query['semester']['semester']);
            semester.updateRelevantLastModifieds();
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(StatusCodes.OK);
        })
        .catch(next);
})

router.get('/semester', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.checkQuery(query,checkList);
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
            utility.expressUtil.handleIfModifiedSince(req,res,semester.getLastModified());
            res.append(utility.httpUtil.headers.LAST_MODIFIED, semester.getLastModified());
            res.status(StatusCodes.OK).json(semester);
        })
        .catch(next);
})

router.get('/semester-list', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.addMissingKeysToQuery(query,['semester']);
    utility.requestUtil.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if(!college) {
                return utility.expressUtil.sendEmptyList(res);
            }
            let course = college.getCourse(query['course']);
            if(!course) {
                return utility.expressUtil.sendEmptyList(res);
            }
            let branch = course.getBranch(query['branch']);
            if(!branch) {
                return utility.expressUtil.sendEmptyList(res);
            }
            utility.expressUtil.handleIfModifiedSince(req,res,branch.getLastListModification());
            let semesterList = [];
            for (semester of branch.semesters) {
                semesterList.push(semester.semester);
            }
            res.append(utility.httpUtil.headers.LAST_MODIFIED,branch.getLastListModification());
            res.status(StatusCodes.OK).json(semesterList);
        })
        .catch(next);
})

module.exports = router;