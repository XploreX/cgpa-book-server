const express = require('express')
const {College} = require('../../models/index.js');
const academiaConsts = require('../academia-constants.js');
const mongoHelpers = require('../../utility/mongo-helpers.js');
const expressHelpers = require('../../utility/express-helpers.js');
let router = express.Router();

let checkList = ['college','course','branch'];

router.post('/branch', (req, res, next) => {
    let query = req.query;
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
            // mongoHelpers.updateLastModifed([college, course, course.getBranch(query['branch']['branch'])]);
            return college.save()
        })
        .then((doc) => {
            res.sendStatus(academiaConsts.STATUS_OK);
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
            res.append(academiaConsts.LAST_MODIFIED_HEADER, branch.lastModified);
            res.status(academiaConsts.STATUS_OK).json(branch);
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
            for (branch of course.branches) {
                if (!branch.branch.match(query['branch']))
                    continue;
                let branchName = branch.branch;
                if (branch.abbreviation) {
                    branchName += " (" + branch.abbreviation + ")";
                }
                branchList.push(branchName);
            }
            res.append(academiaConsts.LAST_MODIFIED_HEADER,course.getLastListModification());
            res.status(academiaConsts.STATUS_OK).json(branchList);
        })
        .catch(next);
})

module.exports = router;