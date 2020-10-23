const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config.js').ROOT;
const utility = require(ROOT+'/utility');
const {College,CollegeHeader} = require(ROOT+'/models');
const academiaHelpers = require('../academia-helpers.js');
let router = express.Router();

let checkList = ['college'];

router.post('/college', (req, res, next) => {
    const query = req.body;
    utility.requestUtil.checkQuery(query, checkList);
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
            res.sendStatus(StatusCodes.OK);
        })
        .catch(next);
})

router.get('/college', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.checkQuery(query, checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return sendEmptyDict(res);
            }
            utility.expressUtil.handleIfModifiedSince(req,res,college.getLastModified());
            res.append(utility.httpUtil.headers.LAST_MODIFIED, college.getLastModified());
            res.status(StatusCodes.OK).json(college);
        })
        .catch(next);
})

router.get('/college-list', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.addMissingKeysToQuery(query, ['college', 'course', 'branch']);
    utility.requestUtil.checkQuery(query, checkList);
    let collegeList = [];
    CollegeHeader.findOne()
        .then((head) => {
            if(head) {
                utility.expressUtil.handleIfModifiedSince(req,res,head.getLastListModification());
                res.append(utility.headers.LAST_MODIFIED,head.getLastListModification());
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
            return res.status(StatusCodes.OK).json(collegeList);
        })
        .catch(next);
})

module.exports = router;