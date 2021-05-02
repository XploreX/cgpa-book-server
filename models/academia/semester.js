const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const subjectSchema = require('./subject.js');

const semesterSchema = new Schema({
  semester: {
    type: String,
    required: true,
  },
  semesterNameHistory: [String],
  semesterId: mongoose.Types.ObjectId,
  creditsTotal: {
    type: Number,
  },
  subjects: [subjectSchema],
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

semesterSchema.pre('save', function(next) {
  this.creditsTotal = 0;
  for (const subject of this.subjects) {
    this.creditsTotal += subject.credits;
  }
  next();
});

semesterSchema.methods.getSubject = function(subjectName) {
  if (subjectName instanceof RegExp) {
    return _.find(this.subjects, (subject) => {
      return subjectName.test(subject.subject);
    });
  } else {
    return _.find(this.subjects, (subject) => {
      return subject.subject == subjectName;
    });
  }
};

semesterSchema.methods.getSubjectById = function(subjectId) {
  return _.find(this.subjects, (subject) => {
    return subject.subjectId == subjectId;
  });
};

semesterSchema.methods.getSubjectByFormerName = function(subjectName) {
  return _.find(this.subjects, (subject) => {
    return _.find(subject.subjectNameHistory, (formerSubjectName) => {
      return subjectName.test(formerSubjectName);
    });
  });
};

semesterSchema.methods.getLastModified =
  utility.mongooseUtil.getLastModified;
semesterSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = semesterSchema;
