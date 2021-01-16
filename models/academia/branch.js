const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const semesterSchema = require('./semester');

const branchSchema = new Schema({
  branch: {
    type: String,
    trim: true,
    minlength: 1,
  },
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

branchSchema.methods.getSemester = function(semesterNumber) {
  return utility.arrayUtil.findNeedle(
      this.semesters,
      semesterNumber,
      'semester',
  );
};

branchSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
branchSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = branchSchema;
