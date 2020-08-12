const express = require('express');
const { College } = require('../models/index.js');
const courseSchema = require('../models/college/course.js');

var router = express.Router();

router.post('/college', (req, res, next) => {
    college = new College(req.body);
    college.save()
        .then((doc) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            err.status = 400;
            next(err);
        });
})

router.get('/college', (req, res, next) => {
    College.findOne(req.body)
        .then((college) => {
            res.status(200).json(college);
        })
        .catch((err) => {
            err.status = 400;
            next(err);
        })
})

router.post('/branch', (req, res, next) => {
    let collegeName = req.body['college'];
    let courseName = req.body['course'];
    let branch = req.body['branch'];
    console.log(branch);
    College.findOne({ college: collegeName })
        .then((college) => {
            if (!college) {
                throw new Error("Given college not found");
            }
            let course = college.getCourse(courseName);
            if(!course) {
                throw new Error("Given college course not found");
            }
            branches = course.branches;
            // branches.push(branch);
            console.log(course);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            err.status = 400;
            next(err);
        })

})

module.exports = router;
