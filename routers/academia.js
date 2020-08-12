const express = require('express');
const { College } = require('../models/index.js');
const courseSchema = require('../models/college/course.js');

var router = express.Router();
const STATUS_OK = 200;

router.post('/college', (req, res, next) => {
    college = new College(req.body);
    college.save()
        .then((doc) => {
            res.sendStatus(STATUS_OK);
        })
        .catch(next);
})

router.get('/college', (req, res, next) => {
    College.findOne(req.body)
        .then((college) => {
            res.status(STATUS_OK).json(college);
        })
        .catch(next);
})

router.get('/course', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            res.status(STATUS_OK).json(course);
        })
        .catch(next);
})

router.post('/branch', (req, res, next) => {
    let collegeName = req.body['college'];
    let courseName = req.body['course'];
    let branch = req.body['branch'];
    College.findOne({ college: collegeName })
        .then((college) => {
            let course = college.getCourse(courseName);
            branches = course.branches;
            branches.push(branch);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(STATUS_OK);
        })
        .catch(next);
})

router.get('/branch', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branch = course.getBranch(query['branch']);
            res.status(STATUS_OK).json(branch);
        })
        .catch(next);
})

router.get('/semester', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branch = course.getBranch(query['branch']);
            let semester = branch.getSemester(query['semester']);
            res.status(STATUS_OK).json(semester);
        })
        .catch(next);
})

router.get('/subject', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branch = course.getBranch(query['branch']);
            let semester = branch.getSemester(query['semester']);
            let subject = semester.getSubject(query['subject']);
            res.status(STATUS_OK).json(subject);
        })
        .catch(next);
})
module.exports = router;
