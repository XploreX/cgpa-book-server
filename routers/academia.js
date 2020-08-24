const express = require('express');
const { College, Course } = require('../models/index.js');
const courseSchema = require('../models/college/course.js');
const { prepareQuery} = require('../utility/dictionary-helpers');
const {updateLastModifed} = require('../utility/mongo-helpers');
const { query } = require('express');

var router = express.Router();
const STATUS_OK = 200;
const LAST_MODIFIED_HEADER = 'Last-Modified';

router.get('/*', (req, res, next) => {
    let query = req.body;
    if (!('college' in query))
        query['college'] = '.*';
    let flags = '';
    if (query['ignorecase'].toLowerCase() == 'true') {
        flags += 'i';
    }
    query['semester'] = Number(query['semester']);
    prepareQuery(query,flags);
    next();
})

router.post('/college', (req, res, next) => {
    college = new College(req.body);
    updateLastModifed([college]);
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
            res.append(LAST_MODIFIED_HEADER, college.lastModified);
            res.status(STATUS_OK).json(college);
        })
        .catch(next);
})

router.get('/college-list', (req, res, next) => {
    query = req.body;
    collegeList = [];
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
            let courses = college.courses;
            courses.push(query['course']);
            updateLastModifed([college, college.getCourse(query['course']['course'])])
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
            res.append(LAST_MODIFIED_HEADER, course.lastModified);
            res.status(STATUS_OK).json(course);
        })
        .catch(next);
})

router.get('/course-list', (req, res, next) => {
    let query = req.body;
    courseList = []

    College.findOne({ college: query['college'] })
        .then((college) => {
            for (course of college.courses) {
                if ('course' in query) {
                    if (!course.course.match(query['course']))
                        continue;
                    if ('branch' in query) {
                        let branch = course.getBranch(query['branch'])
                        if (!branch)
                            continue;
                    }
                }
                let courseName = course.course;
                if(course.abbreviation)
                    courseName+=" ("+course.abbreviation+")";
                courseList.push(courseName);
            }
            res.status(STATUS_OK).json(courseList);
        })
        .catch(next)
})

router.post('/branch', (req, res, next) => {
    let query = req.body;
    let branch = req.body['branch'];
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            if (!course) {
                college.courses.push({ course: query['course'] })
                course = college.getCourse(query['course'])
            }
            
            branches = course.branches;
            branches.push(branch);
            updateLastModifed([college, course, course.getBranch(query['branch']['branch'])]);
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
            res.append(LAST_MODIFIED_HEADER, branch.lastModified);
            res.status(STATUS_OK).json(branch);
        })
        .catch(next);
})

router.get('/branch-list', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branchList = [];
            for (branch of course.branches) {
                if ('branch' in query) {
                    if (!branch.branch.match(query['branch']))
                        continue;
                }
                let branchName = branch.branch;
                if(branch.abbreviation) {
                    branchName+=" ("+branch.abbreviation+")";
                }
                branchList.push(branchName);
            }
            res.status(STATUS_OK).json(branchList);
        })
        .catch(next);
})

router.post('/semester', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            if (!course) {
                college.courses.push({ 'course': query['course'] });
                course = college.getCourse(query['course']);
            }
            let branch = course.getBranch(query['branch']);
            if (!branch) {
                course.branches.push({ 'branch': query['branch'] });
                branch = course.getBranch(query['branch']);
            }
            let semesters = branch.semesters;
            semesters.push(query['semester']);
            updateLastModifed([college, course, branch, branch.getSemester(query['semester']['semester'])]);
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
            console.log(branch);
            let semester = branch.getSemester(query['semester']);
            res.append(LAST_MODIFIED_HEADER, semester.lastModified);
            res.status(STATUS_OK).json(semester);
        })
        .catch(next);
})

router.get('/semester-list', (req, res, next) => {
    let query = req.body;
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            let branch = course.getBranch(query['branch']);
            let semesterList = [];
            for (semester of branch.semesters) {
                semesterList.push(semester.semester);
            }
            res.status(STATUS_OK).json(semesterList);
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
