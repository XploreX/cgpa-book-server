const express = require('express');
const {College} = require('../../models/index.js');
const academiaConsts = require('../academia-constants.js');
const { checkQuery, checkExistance,addMissingKeysToQuery} = require('../../utility/mongo-helpers.js');
const {sendEmptyList,sendEmptyDict} = require('../../utility/express-helpers.js');
let router = express.Router();

let checkList = ['college','course'];

router.post('/course', (req, res, next) => {
    let query = req.query;
    checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            checkExistance(college, 'college');
            college.addToList(query['course']);
            // updateLastModifed([college, college.getCourse(query['course']['course'])])
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(academiaConsts.STATUS_OK);
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
            res.append(academiaConsts.LAST_MODIFIED_HEADER, course.lastModified);
            res.status(academiaConsts.STATUS_OK).json(course);
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
            res.append(academiaConsts.LAST_MODIFIED_HEADER,college.getLastListModification());
            res.status(academiaConsts.STATUS_OK).json(courseList);
        })
        .catch(next)
})

module.exports = router;