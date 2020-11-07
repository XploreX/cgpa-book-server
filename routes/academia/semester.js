const express = require("express");
const { StatusCodes } = require("http-status-codes");

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");
const { College } = require(ROOT + "/models").academia;
const academiaServices = require(ROOT + '/services/academia');
const CustomError = require(ROOT + '/CustomError');
let router = express.Router();

let checkList = ["college", "course", "branch", "semester"];

router.post("/semester", (req, res, next) => {
  let query = req.body;
  utility.requestUtil.ensureCertainFields(query, checkList);
  academiaServices.fillMissingData(query)
    .then((queryRes) => {
      console.log('queryRes from fillMissingData :',queryRes);
      return College.updateOne({
        college: query['college'],
        courses: {
          $elemMatch: {
            course: query['course'],
            branches: {
              $elemMatch: {
                branch: query['branch'],
                'semesters.semester': { $ne: query['semester']['semester'] }
              }
            }
          }
        }
      }, {
        $push: { 'courses.$[i].branches.$[j].semesters': query['semester'] },
        $currentDate : academiaServices.getDateUpdateDict('i','j')
      },{
        arrayFilters : [
          {'i.course' : query['course']},
          {'j.branch' : query['branch']}
        ]
      })
        .exec();
    })
    .then(academiaServices.checkDataFill)
    .then(() => {
      // res.sendStatus(StatusCodes.OK);
      res.sendStatus(StatusCodes.OK);
    })
    .catch(next);
});

router.get("/semester", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({ college: query["college"] })
    .exec()
    .then((college) => {
      if (!college) {
        return utility.expressUtil.sendEmptyDict(res);
      }
      let course = college.getCourse(query["course"]);
      if (!course) {
        return utility.expressUtil.sendEmptyDict(res);
      }
      let branch = course.getBranch(query["branch"]);
      if (!branch) {
        return utility.expressUtil.sendEmptyDict(res);
      }
      let semester = branch.getSemester(query["semester"]);
      if (!semester) {
        return utility.expressUtil.sendEmptyDict(res);
      }
      utility.expressUtil.handleIfModifiedSince(
        req,
        res,
        semester.getLastModified()
      );
      res.append(
        utility.httpUtil.headers.LAST_MODIFIED,
        semester.getLastModified()
      );
      res.status(StatusCodes.OK).json(semester);
    })
    .catch(next);
});

router.get("/semester-list", (req, res, next) => {
  let query = req.query;
  utility.requestUtil.addMissingKeysToQuery(query, ["semester"]);
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.findOne({ college: query["college"] })
    .exec()
    .then((college) => {
      if (!college) {
        return utility.expressUtil.sendEmptyList(res);
      }
      let course = college.getCourse(query["course"]);
      if (!course) {
        return utility.expressUtil.sendEmptyList(res);
      }
      let branch = course.getBranch(query["branch"]);
      if (!branch) {
        return utility.expressUtil.sendEmptyList(res);
      }
      utility.expressUtil.handleIfModifiedSince(
        req,
        res,
        branch.getLastListModification()
      );
      let semesterList = [];
      for (semester of branch.semesters) {
        semesterList.push(semester.semester);
      }
      semesterList.sort();
      res.append(
        utility.httpUtil.headers.LAST_MODIFIED,
        branch.getLastListModification()
      );
      res.status(StatusCodes.OK).json(semesterList);
    })
    .catch(next);
});

module.exports = router;
