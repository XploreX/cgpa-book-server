const mongoose = require('mongoose');

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
  branches: [branchSchema],
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
    for (const branch of this.branches) {
      if (branch.branch.match(branchName)) {
        return branch;
      }
    }
  } else {
    return utility.arrayUtil.findNeedle(
        this.branches,
        branchName,
        'branch',
        true,
    );
  }
  return null;
};

courseSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
courseSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = courseSchema;
