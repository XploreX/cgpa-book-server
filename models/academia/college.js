const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const ROOT = require(__dirname + '/../../config').ROOT;
const courseSchema = require('./course');
const utility = require(ROOT + '/utility');

const collegeSchema = new Schema({
  college: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    index: true,
  },
  collegeNameHistory: [String],
  collegeId: mongoose.Types.ObjectId,
  abbreviation: {
    type: String,
    trim: true,
    minlength: 1,
  },
  courses: [courseSchema],
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

collegeSchema.pre('validate', function(next) {
  // this.college = getTitleForm(this.college);
  if (!this.abbreviation) {
    this.abbreviation = utility.stringUtil.getAbbreviation(this.college);
  }
  next();
});

collegeSchema.methods.getCourse = function(courseName) {
  return _.find(this.courses, (course) => {
    return courseName.test(course.course);
  });
};

collegeSchema.methods.getCourseById = function(courseId) {
  return _.find(this.courses, (course) => {
    return course.courseId.equals(courseId);
  });
};

collegeSchema.methods.getCourseByFormerName = function(courseName) {
  return _.find(this.courses, (course) => {
    return _.find(course.courseNameHistory, (formerCourseName) => {
      return courseName.test(formerCourseName);
    });
  });
};

collegeSchema.methods.getLastModified =
  utility.mongooseUtil.getLastModified;
collegeSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = collegeSchema;
