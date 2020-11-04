const express = require("express");
const { StatusCodes } = require("http-status-codes");

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");
const { College } = require(ROOT + "/models").academia;

let router = express.Router();

let checkList = ["college", "course", "branch", "semester"];

router.post("/semester", (req, res, next) => {
  let query = req.body;
  utility.requestUtil.ensureCertainFields(query, checkList);
  College.updateOne(
    {
      college: query['college'],
      'courses.course': { '$ne': query['course'] }
    },
    {
      $push: { courses: { course: query['course'] } }
    })
    .exec()
    .then(() => {
      return College.updateOne(
        {
          college: query['college'],
          'courses': {
            $elemMatch: {
              course: query['course'],
              'branches.branch': { $ne: query['branch'] }
            }
          }
        },
        {
          $push: {
            'courses.$.branches': {
              branch: query['branch'],
              abbreviation : utility.stringUtil.getAbbreviation(query['branch'])
            }
          }
        }
      )
        .exec();
    })
    .then(() => {
      return College.updateOne(
        {
          college: query['college'],
          courses: {
            $elemMatch: {
              course: query['course'],
              'branches': {
                $elemMatch: {
                  'branch': query['branch'],
                  'semesters.semester': { $ne: query['semester']['semester'] }
                }
              }
            }
          }
        },
        {
          $push: { 'courses.$[i].branches.$[j].semesters': query['semester'] }
        }, {
        arrayFilters: [
          { 'i.course': query['course'] },
          { 'j.branch': query['branch'] }
        ]
      })
        .exec();
    })
    .then((queryRes) => {
      console.log(queryRes);
      return queryRes
      /* return College.findOne({ college: query["college"] })
        .exec() */
    })
    .then((college) => {
      /* utility.errorUtil.ensureExistence(college, "college");
      let course = college.getCourse(query["course"]);
      let branch = course.getBranch(query["branch"]);
      branch.addToList(query["semester"]);
      let semester = branch.getSemester(query["semester"]["semester"]);
      return college.save(); */
      return college;
    })
    .then((doc) => {
      // res.sendStatus(StatusCodes.OK);
      res.status(StatusCodes.OK).json(doc);
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
