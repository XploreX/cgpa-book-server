const express = require('express');
const { College, CollegeHeader } = require('../../models/index.js');
const academiaHelpers = require('../academia-helpers.js');
const { updateLastModifed } = require('../../utility/mongo-helpers');
const { checkExistance, checkQuery, addMissingKeysToQuery } = require('../../utility/mongo-helpers');
const { sendEmptyDict, sendEmptyList } = require('../../utility/express-helpers');
const httpHelpers = require('../../utility/http-helpers.js');

let router = express.Router();

let checkList = ['college'];

router.post('/college', (req, res, next) => {
    const query = req.body;
    checkQuery(query, checkList);
    college = new College(query['college']);
    college.updateRelevantLastModifieds();
    college.save()
        .then((doc) => {
            return CollegeHeader.findOne();
        })
        .then((head) => {
            if (!head) {
                head = new CollegeHeader();
            }
            head.lastListModification = new Date();
            return head.save()
        })
        .then((head) => {
            res.sendStatus(httpHelpers.STATUS_OK);
        })
        .catch(next);
})

router.get('/college', (req, res, next) => {
    let query = req.query;
    checkQuery(query, checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyDict(res);
            }
            httpHelpers.handleIfModifiedSince(req,res,college.getLastModified());
            res.append(httpHelpers.HEADER_LAST_MODIFIED, college.getLastModified());
            res.status(httpHelpers.STATUS_OK).json(college);
        })
        .catch(next);
})

router.get('/college-list', (req, res, next) => {
    let query = req.query;
    addMissingKeysToQuery(query, ['college', 'course', 'branch']);
    checkQuery(query, checkList);
    let collegeList = [];
    CollegeHeader.findOne()
        .then((head) => {
            if(head) {
                httpHelpers.handleIfModifiedSince(req,res,head.getLastListModification());
                res.append(httpHelpers.HEADER_LAST_MODIFIED,head.getLastListModification());
            }
            return College.find({ college: query['college'] });
        })
        .then((colleges) => {
            console.log(req.get(httpHelpers.HEADER_IF_MODIFIED_SINCE));
            for (college of colleges) {
                let course = college.getCourse(query['course']);
                if (course || (''.match(query['course']))) {
                    let branch = null;
                    if (course)
                        branch = course.getBranch(query['branch']);
                    if (!branch && !(''.match(query['branch'])))
                        continue;
                }
                else continue;
                collegeName = college.college;
                if (college['abbreviation']) {
                    collegeName += ' ( ' + college.abbreviation + ' ) ';
                }
                collegeList.push(collegeName);
            }
            return res.status(httpHelpers.STATUS_OK).json(collegeList);
        })
        .catch(next);
})

module.exports = router;