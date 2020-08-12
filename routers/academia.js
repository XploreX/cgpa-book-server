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

module.exports = router;