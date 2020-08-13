const express = require('express');
const { College, Course } = require('../models/index.js');
const courseSchema = require('../models/college/course.js');
const { updateValuesToIgnorecase,updateValuesToRegExp } = require('../utility/dictionary-helpers');

var router = express.Router();
const STATUS_OK = 200;

router.get('/*',(req,res,next) => {
    query = req.body;
    if(!('college' in query))
        query['college'] = '.*';
    if(query['ignorecase'])
    {
        updateValuesToIgnorecase(query);
    }
    else {
        updateValuesToRegExp(query);
    }
    next();
})

router.post('/college', (req, res, next) => {
    college = new College(req.body);
    college.save()
        .then((doc) => {
            res.sendStatus(STATUS_OK);
        })
        .catch(next);
})

router.get('/college', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            res.status(STATUS_OK).json(college);
        })
        .catch(next);
})

router.get('/college-list', (req, res, next) => {
    query = req.body;
    collegeList = [];
    // console.log(query);
    College.find({ college: query['college'] })
        .then((colleges) => {
            for (college of colleges) {
                if ('course' in query) {
                    let course = college.getCourse(query['course']);
                    if (course) {
                        if ('branch' in query) {
                            let branch = course.getBranch(query['branch']);
                            if (!branch)
                                continue;
                        }
                    }
                    else continue;
                }
                collegeName = college.college;
                if (college['abbreviation']) {
                    collegeName += ' ( ' + college.abbreviation + ' ) ';
                }
                collegeList.push(collegeName);
            }
            res.status(STATUS_OK).json(collegeList);
        })
        .catch(next);
})

router.post('/course', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            courses = college.courses;
            courses.push(query['course']);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(STATUS_OK);
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

router.post('/semester', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branch = course.getBranch(query['branch']);
            let semesters = branch.semesters;
            semesters.push(query['semester']);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(STATUS_OK);
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
