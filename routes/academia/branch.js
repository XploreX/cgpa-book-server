const express = require('express')
const {College} = require('../../models/index.js');
const academiaHelpers = require('../academia-helpers.js');
const mongoHelpers = require('../../utility/mongo-util.js');
const expressHelpers = require('../../utility/express-util.js');
const httpHelpers = require('../../utility/http-util.js');
let router = express.Router();

let checkList = ['college','course','branch'];

router.post('/branch', (req, res, next) => {
    let query = req.post;
    mongoHelpers.checkQuery(query,checkList);
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
            res.sendStatus(httpHelpers.STATUS_OK);
        })
        .catch(next);
})

router.get('/branch', (req, res, next) => {
    let query = req.query;
    mongoHelpers.checkQuery(query,checkList);
    College.findOne({ college: query['college'] })
        .then((college) => {
            if (!college) {
                return expressHelpers.sendEmptyDict(res);
            }
            let course = college.getCourse(query['course']);
            if (!course) {
                return expressHelpers.sendEmptyDict(res);
            }
            let branch = course.getBranch(query['branch']);
            if (!branch) {
                return expressHelpers.sendEmptyDict(res);
            }
            httpHelpers.handleIfModifiedSince(req,res,branch.getLastModified());
            res.append(httpHelpers.HEADER_LAST_MODIFIED, branch.getLastModified());
            res.status(httpHelpers.STATUS_OK).json(branch);
        })
        .catch(next);
})

router.get('/branch-list', (req, res, next) => {
    let query = req.query;
    mongoHelpers.addMissingKeysToQuery(query, ['branch']);
    mongoHelpers.checkQuery(query,checkList);
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
            httpHelpers.handleIfModifiedSince(req,res,course.getLastListModification());
            for (branch of course.branches) {
                if (!branch.branch.match(query['branch']))
                    continue;
                let branchName = branch.branch;
                if (branch.abbreviation) {
                    branchName += " (" + branch.abbreviation + ")";
                }
                branchList.push(branchName);
            }
            res.append(httpHelpers.HEADER_LAST_MODIFIED,course.getLastListModification());
            res.status(httpHelpers.STATUS_OK).json(branchList);
        })
        .catch(next);
})

module.exports = router;