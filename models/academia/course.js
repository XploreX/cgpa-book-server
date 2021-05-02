const mongoose = require('mongoose');
const _ = require('lodash');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const branchSchema = require('./branch');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  course: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  courseNameHistory: [String],
  branches: [branchSchema],
  courseId: mongoose.Types.ObjectId,
  gpaMetric: {
    type: String,
    trim: true,
    minlength: 1,
  },
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

courseSchema.methods.getBranch = function(branchName) {
  if (branchName instanceof RegExp) {
    return _.find(this.branches, (branch) => {
      return branchName.test(branch.branch);
    });
  } else {
    return _.find(this.branches, (branch) => {
      return branch.branch == branchName;
    });
  }
};

courseSchema.methods.getBranchById = function(branchId) {
  return _.find(this.branches, (branch) => {
    return branch.branchId == branchId;
  });
};

courseSchema.methods.getBranchByFormerName = function(branchName) {
  return _.find(this.branches, (branch) => {
    return _.find(branch.branchNameHistory, (formerBranchName) => {
      return branchName.test(formerBranchName);
    });
  });
};

courseSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
courseSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = courseSchema;
