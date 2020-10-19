const express = require('express')
const {StatusCodes} = require('http-status-codes');

const __ROOT = require('/../../config.js');
const utility = require(__ROOT+'utility');
const {College} = require(__ROOT+'/models');
const academiaHelpers = require('../academia-helpers.js');

let router = express.Router();

let checkList = ['college','course','branch'];

router.post('/branch', (req, res, next) => {
    let query = req.post;
    utility.requestUtil.checkQuery(query,checkList);
    let branch = req.query['branch'];
    College.findOne({ college: query['college'] })
        .then((college) => {
            let course = college.getCourse(query['course']);
            if (!course) {
                college.addToList({course: query['course'] })
                course = college.getCourse(query['course'])
            }
            course.addToList(branch);
            branch = course.getBranch(query['branch']['branch']);
            branch.updateRelevantLastModifieds();
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(StatusCodes.OK);
        })
        .catch(next);
})

router.get('/branch', (req, res, next) => {
    let query = req.query;
    utility.requestUtil.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if (!course) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            let branch = course.getBranch(query['branch']);
            if (!branch) {
                return utility.expressUtil.sendEmptyDict(res);
            }
            utility.expressUtil.handleIfModifiedSince(req,res,branch.getLastModified());
            res.append(utility.httpUtil.headers.LAST_MODIFIED, branch.getLastModified());
            res.status(StatusCodes.OK).json(branch);
        })
        .catch(next);
})

router.get('/branch-list', (req, res, next) => {
    let query = req.query;
    mongoHelpers.addMissingKeysToQuery(query, ['branch']);
    utility.requestUtil.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if(! college) {
                return expressHelpers.sendEmptyList(res);
            }
            let course = college.getCourse(query['course']);
            if(! course) {
                return expressHelpers.sendEmptyList(res);
            }
            let branchList = [];
            utility.expressUtil.handleIfModifiedSince(req,res,course.getLastListModification());
            for (branch of course.branches) {
                if (!branch.branch.match(query['branch']))
                    continue;
                let branchName = branch.branch;
                if (branch.abbreviation) {
                    branchName += " (" + branch.abbreviation + ")";
                }
                branchList.push(branchName);
            }
            res.append(utility.httpUtil.headers.LAST_MODIFIED,course.getLastListModification());
            res.status(StatusCodes.OK).json(branchList);
        })
        .catch(next);
})

module.exports = router;