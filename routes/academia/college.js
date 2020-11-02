const express = require("express");
const { StatusCodes } = require("http-status-codes");

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");
const { College, CollegeHeader } = require(ROOT + "/models").academia;
let router = express.Router();

let checkList = ["college"];

router.post("/college", (req, res, next) => {
  const query = req.body;
  utility.requestUtil.ensureCertainFields(query, checkList);
  college = new College(query["college"]);
  college
    .save()
    .then((doc) => {
      return CollegeHeader.updateLastListModification();
    })
    .then(() => {
      res.sendStatus(StatusCodes.OK);
    })
    .catch(next);
});

router.get("/college", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({ college: query["college"] })
    .exec()
    .then((college) => {
      if (!college) {
        return utility.responseUtil.sendEmptyDict(res);
      }
      utility.expressUtil.handleIfModifiedSince(
        req,
        res,
        college.getLastModified()
      );
      res.append(
        utility.httpUtil.headers.LAST_MODIFIED,
        college.getLastModified()
      );
      res.status(StatusCodes.OK).json(college);
    })
    .catch(next);
});

router.get("/college-list", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.addMissingKeysToQuery(query, [
    "college",
    "course",
    "branch",
  ]);
  utility.requestUtil.ensureCertainFields(query, checkList);
  let collegeList = [];
  CollegeHeader.getLastListModification()
    .exec()
    .then((lastListModification) => {
      if (lastListModification) {
        utility.expressUtil.handleIfModifiedSince(
          req,
          res,
          lastListModification
        );
        res.append(
          utility.httpUtil.headers.LAST_MODIFIED,
          lastListModification()
        );
      }
      return College.find({ college: query["college"] }).exec();
    })
    .then((colleges) => {
      // console.log(req.get(utility.httpUtil.headers.IF_MODIFIED_SINCE));
      for (college of colleges) {
        let course = college.getCourse(query["course"]);
        if (course || "".match(query["course"])) {
          let branch = null;
          if (course) branch = course.getBranch(query["branch"]);
          if (!branch && !"".match(query["branch"])) continue;
        } else continue;
        collegeName = college.college;
        if (college["abbreviation"]) {
          collegeName += " ( " + college.abbreviation + " ) ";
        }
        collegeList.push(collegeName);
      }
      return res.status(StatusCodes.OK).json(collegeList);
    })
    .catch(next);
});

module.exports = router;
