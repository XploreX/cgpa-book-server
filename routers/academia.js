const express = require('express');
const {College} = require('../models/index.js');

var router = express.Router();

router.post('/college',(req,res,next) => {
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

router.get('/college',(req,res,next) => {
    College.findOne(req.body)
    .then((college) => {
        console.log(college);
        res.status(200).json(college);
    })
    .catch((err) => {
        err.status = 400;
        next(err);
    })
})

/* router.post('/branch',(req,res,next) => {
    let collegeName = req.body['college'];
    let courseName = req.body['course'];

}) */

module.exports = router;