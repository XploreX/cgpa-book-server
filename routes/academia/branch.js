const express = require("express");
const { StatusCodes } = require("http-status-codes");

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");
const { College } = require(ROOT + "/models").academia;
const CustomError = require(ROOT + '/CustomError');
const academiaServices = require(ROOT + '/services/academia');

let router = express.Router();

let checkList = ["college", "course", "branch"];

router.post("/branch", (req, res, next) => {
  let query = req.post;
  utility.requestUtil.ensureCertainFields(query, checkList);
  academiaServices.fillMissingData(query)
    .then(() => {
      return College.updateOne({
        college: query['college'],
        courses: {
          $elemMatch: {
            course: query['course'],
            'branches.branch': { $ne: query['branch']['branch'] }
          }
        }
      }, {
        $push: { 'courses.$.branches': query['branch'] },
        $currentDate : academiaServices.getdateUpdateDict()
      })
        .exec();
    })
    .then(academiaServices.checkDataFill)
    .then(() => {
      res.sendStatus(StatusCodes.OK);
    })
    .catch(next);
});

router.get("/branch", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({ college: query["college"] })
    .exec()
    .then((college) => {
      if (!college) {
        return utility.responseUtil.sendEmptyDict(res);
      }
      let course = college.getCourse(query["course"]);
      if (!course) {
        return utility.responseUtil.sendEmptyDict(res);
      }
      let branch = course.getBranch(query["branch"]);
      if (!branch) {
        return utility.eresponseUtilsendEmptyDict(res);
      }
      utility.expressUtil.handleIfModifiedSince(
        req,
        res,
        branch.getLastModified()
      );
      res.append(
        utility.httpUtil.headers.LAST_MODIFIED,
        branch.getLastModified()
      );
      res.status(StatusCodes.OK).json(branch);
    })
    .catch(next);
});

router.get("/branch-list", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.addMissingKeysToQuery(query, ["branch"]);
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({ college: query["college"] })
    .exec()
    .then((college) => {
      if (!college) {
        return utility.responseUtil.sendEmptyList(res);
      }
      let course = college.getCourse(query["course"]);
      if (!course) {
        return utility.responseUtil.sendEmptyList(res);
      }
      let branchList = [];
      utility.expressUtil.handleIfModifiedSince(
        req,
        res,
        course.getLastListModification()
      );
      for (branch of course.branches) {
        if (!branch.branch.match(query["branch"])) continue;
        let branchName = branch.branch;
        if (branch.abbreviation) {
          branchName += " (" + branch.abbreviation + ")";
        }
        branchList.push(branchName);
      }
      res.append(
        utility.httpUtil.headers.LAST_MODIFIED,
        course.getLastListModification()
      );
      res.status(StatusCodes.OK).json(branchList);
    })
    .catch(next);
});

module.exports = router;
