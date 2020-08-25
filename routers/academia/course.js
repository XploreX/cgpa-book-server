const express = require('express');
const {College} = require('../../models/index.js');
const academiaConsts = require('../academia-constants.js');
const { checkQuery, checkExistance,addMissingKeysToQuery} = require('../../utility/mongo-helpers.js');
const {sendEmptyList,sendEmptyDict} = require('../../utility/express-helpers.js');
let router = express.Router();

router.post('/course', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            checkExistance(college, 'college');
            let courses = college.courses;
            courses.push(query['course']);
            updateLastModifed([college, college.getCourse(query['course']['course'])])
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(academiaConsts.STATUS_OK);
        })
        .catch(next);
})

router.get('/course', (req, res, next) => {
    let query = req.body;
    checkQuery(query, ['college', 'course']);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if(! course) {
                return sendEmptyDict();
            }
            res.append(academiaConsts.LAST_MODIFIED_HEADER, course.lastModified);
            res.status(academiaConsts.STATUS_OK).json(course);
        })
        .catch(next);
})

router.get('/course-list', (req, res, next) => {
    let query = req.body;
    addMissingKeysToQuery(query, ['college', 'branch']);
    checkQuery(query, ['college']);
    let courseList = [];

    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyList(res);
            }
            for (course of college.courses) {
                if (!course.course.match(query['course']))
                    continue;
                let branch = course.getBranch(query['branch'])
                if (!branch)
                    continue;
                let courseName = course.course;
                if (course.abbreviation)
                    courseName += " (" + course.abbreviation + ")";
                courseList.push(courseName);
            }
            res.status(academiaConsts.STATUS_OK).json(courseList);
        })
        .catch(next)
})

module.exports = router;