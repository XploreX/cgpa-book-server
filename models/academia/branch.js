const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const semesterSchema = require('./semester');

const branchSchema = new Schema({
  branch: {
    type: String,
    trim: true,
    minlength: 1,
  },
  branchNameHistory: [String],
  branchId: mongoose.Types.ObjectId,
  abbreviation: {
    type: String,
    trim: true,
    minlength: 1,
  },
  semesters: [semesterSchema],
  createdAt: {
    type: 'Date',
    default: Date.now,
  },
  updatedAt: {
    type: 'Date',
    default: Date.now,
  },
  lastListModification: {
    type: Date,
    default: Date.now,
  },
});

branchSchema.methods.getSemester = function(semesterName) {
  // semester name have to match exactly unlike course, branch
  // and subject names
  return _.find(this.semesters, (semester) => {
    return semester.semester == semesterName;
  });
};

branchSchema.methods.getSemesterById = function(semesterId) {
  return _.find(this.branches, (semester) => {
    return semester.semesterId.equals(semesterId);
  });
};

branchSchema.methods.getSemesterByFormerName = function(semesterName) {
  return _.find(this.branches, (semester) => {
    return _.find(semester.semesterNameHistory, (formerSemesterName) => {
      return formerSemesterName == semesterName;
    });
  });
};

branchSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
branchSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = branchSchema;
