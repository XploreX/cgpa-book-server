const express = require('express');
const { College, CollegeHeader } = require('../../models/index.js');
const academiaConsts = require('../academia-constants.js');
const { updateLastModifed } = require('../../utility/mongo-helpers');
const { checkExistance, checkQuery, addMissingKeysToQuery } = require('../../utility/mongo-helpers');
const { sendEmptyDict, sendEmptyList } = require('../../utility/express-helpers');

let router = express.Router();

let checkList = ['college'];

router.post('/college', (req, res, next) => {
    college = new College(req.body);
    updateLastModifed([college]);
    college.save()
        .then((doc) => {
            return CollegeHeader.findOne();
        })
        .then((head) => {
            if(!head) {
                head = new CollegeHeader();
            }
            head.lastListModification = new Date();
            return head.save()
        })
        .then((head) => {
            console.log(head);
            res.sendStatus(academiaConsts.STATUS_OK);
        })
        .catch(next);
})

router.get('/college', (req, res, next) => {
    let query = req.body;
    checkQuery(query, checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyDict(res);
            }
            res.append(academiaConsts.LAST_MODIFIED_HEADER, college.lastModified);
            res.status(academiaConsts.STATUS_OK).json(college);
        })
        .catch(next);
})

router.get('/college-list', (req, res, next) => {
    let query = req.body;
    addMissingKeysToQuery(query, ['college', 'course', 'branch']);
    checkQuery(query, checkList);
    let collegeList = [];
    College.find({ college: query['college'] })
        .then((colleges) => {
            for (college of colleges) {
                let course = college.getCourse(query['course']);
                if (course || (''.match(query['course']))) {
                    let branch = null;
                    if (course)
                        branch = course.getBranch(query['branch']);
                    if (!branch && (''.match(query['branch'])))
                        continue;
                }
                else continue;
                collegeName = college.college;
                if (college['abbreviation']) {
                    collegeName += ' ( ' + college.abbreviation + ' ) ';
                }
                collegeList.push(collegeName);
            }
            return CollegeHeader.findOne();
        })
        .then((head) => {
            if (head)
                res.append(academiaConsts.LAST_MODIFIED_HEADER, head.lastListModified);
            res.status(academiaConsts.STATUS_OK).json(collegeList);
        })
        .catch(next);
})

module.exports = router;