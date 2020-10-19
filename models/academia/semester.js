const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const __ROOT = require(__dirname + '/../../config.js').__ROOT;
const utility = require(__ROOT + '/utility');
const subjectSchema = require('./subject.js');
const { findNeedle } = require('../../utility/array-util.js');

var semesterSchema = new Schema({
    semester: {
        type: Number,
        required: true,
    },
    creditsTotal: {
        type: Number,
    },
    subjects: [subjectSchema],
    lastModified: {
        type: Date,
    },
    lastListModification: {
        type: Date
    }
});

semesterSchema.pre('save', function (next) {
    this.creditsTotal = 0;
    for (let subject of this.subjects) {
        this.creditsTotal += subject.credits;
    }
    next();
})

semesterSchema.methods.addToList = function(subject) {
    this.subjects.push(subject);
    this.lastListModification = new Date();
}

semesterSchema.methods.getSubject = function (subjectName) {
    if (subjectName instanceof RegExp) {
        for (let subject of this.subjects) {
            if (subject.subject.match(subjectName)) {
                return subject;
            }
        }
    }
    else {
        return findNeedle(this.subjects,subjectName,true,'subject');
    }
    return null;
}

semesterSchema.methods.subjectID = function (subjectName) {
    for (let subject of this.subjects) {
        if (subject.subject.match(subjectName)) {
            return subject._id;
        }
    }
    return -1;
}

semesterSchema.methods.updateAncestorsLastModified = utility.mongooseUtil.updateAncestorsLastModified;
semesterSchema.methods.updateLastModified = utility.mongooseUtil.updateLastModified;
semesterSchema.methods.updateDescendantsLastModified = utility.mongooseUtil.genUpdateDescendantsLastModified('subjects');
semesterSchema.methods.updateRelevantLastModifieds = utility.mongooseUtil.updateRelevantLastModifieds;
semesterSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
semesterSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;

module.exports = semesterSchema;

