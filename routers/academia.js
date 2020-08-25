const express = require('express');
const { College, Course } = require('../models/index.js');
const courseSchema = require('../models/college/course.js');
const { prepareQuery } = require('../utility/dictionary-helpers');
const { updateLastModifed } = require('../utility/mongo-helpers');
const {checkExistance} = require('../utility/error-handlers');
const academiaConsts = require('./academia-constants.js');

const collegeRouter = require('./academia/college.js');
const courseRouter = require('./academia/course.js');
const branchRouter = require('./academia/branch.js');
const semesterRouter = require('./academia/semester.js');
const subjectRouter = require('./academia/subject.js');
var router = express.Router();


router.get('/*', (req, res, next) => {
    let query = req.body;
    let flags = '';
    if ('ignorecase' in query) {
        if (query['ignorecase'].toLowerCase() == 'true') {
            flags += 'i';
        }
    }
    if ('semester' in query) {
        query['semester'] = Number(query['semester']);
    }
    prepareQuery(query, flags);
    next();
})

router.use(collegeRouter);
router.use(courseRouter);
router.use(branchRouter);
router.use(semesterRouter);
router.use(subjectRouter);

module.exports = router;
