const express = require('express');
const {College} = require('../../models/index.js');
const academiaHelpers = require('../academia-helpers.js');
const { checkQuery, checkExistance,addMissingKeysToQuery} = require('../../utility/mongo-util.js');
const {sendEmptyList,sendEmptyDict} = require('../../utility/express-util.js');
const httpHelpers = require('../../utility/http-util.js');
let router = express.Router();

let checkList = ['college','course'];

router.post('/course', (req, res, next) => {
    let query = req.body;
    checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            checkExistance(college, 'college');
            college.addToList(query['course']);
            let course = college.getCourse(query['course']['course']);
            course.updateRelevantLastModifieds();
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(httpHelpers.STATUS_OK);
        })
        .catch(next);
})

router.get('/course', (req, res, next) => {
    let query = req.query;
    checkQuery(query, checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if(! course) {
                return sendEmptyDict();
            }
            httpHelpers.handleIfModifiedSince(req,res,course.getLastModified());
            res.append(httpHelpers.HEADER_LAST_MODIFIED, course.getLastModified());
            res.status(httpHelpers.STATUS_OK).json(course);
        })
        .catch(next);
})

router.get('/course-list', (req, res, next) => {
    let query = req.query;
    addMissingKeysToQuery(query, ['course','branch']);
    checkQuery(query, checkList);
    let courseList = [];

    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyList(res);
            }
            httpHelpers.handleIfModifiedSince(req,res,college.getLastListModification());
            for (course of college.courses) {
                if (!course.course.match(query['course']))
                    continue;
                let branch = course.getBranch(query['branch'])
                if (!branch && !(''.match(query['branch'])))
                    continue;
                let courseName = course.course;
                if (course.abbreviation)
                    courseName += " (" + course.abbreviation + ")";
                courseList.push(courseName);
            }
            res.append(httpHelpers.HEADER_LAST_MODIFIED,college.getLastListModification());
            res.status(httpHelpers.STATUS_OK).json(courseList);
        })
        .catch(next)
})

module.exports = router;