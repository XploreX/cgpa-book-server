const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const subjectSchema = require('./subject.js');

const semesterSchema = new Schema({
  semester: {
    type: String,
    required: true,
  },
  semesterNameHistory: [String],
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
    for (const subject of this.subjects) {
      if (subject.subject.match(subjectName)) {
        return subject;
      }
    }
  } else {
    return utility.arrayUtil.findNeedle(
        this.subjects,
        subjectName,
        true,
        'subject',
    );
  }
  return null;
};

semesterSchema.methods.getLastModified =
  utility.mongooseUtil.getLastModified;
semesterSchema.methods.getLastListModification =
  utility.mongooseUtil.getLastListModification;

module.exports = semesterSchema;
