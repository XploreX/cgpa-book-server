const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");
const subjectSchema = require("./subject.js");

var semesterSchema = new Schema(
  {
    semester: {
      type: Number,
      required: true,
    },
    creditsTotal: {
      type: Number,
    },
    subjects: [subjectSchema],
    lastListModification: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

semesterSchema.pre("save", function (next) {
  this.creditsTotal = 0;
  for (let subject of this.subjects) {
    this.creditsTotal += subject.credits;
  }
  next();
});

semesterSchema.methods.addToList = function (subject) {
  this.subjects.push(subject);
  this.lastListModification = new Date();
};

semesterSchema.methods.getSubject = function (subjectName) {
  if (subjectName instanceof RegExp) {
    for (let subject of this.subjects) {
      if (subject.subject.match(subjectName)) {
        return subject;
      }
    }
  } else {
    return utility.arrayUtil.findNeedle(this.subjects, subjectName, true, "subject");
  }
  return null;
};

semesterSchema.methods.subjectID = function (subjectName) {
  for (let subject of this.subjects) {
    if (subject.subject.match(subjectName)) {
      return subject._id;
    }
  }
  return -1;
};

semesterSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
semesterSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;

module.exports = semesterSchema;
