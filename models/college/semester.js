const mongoose = require('mongoose');
const subjectSchema = require('./subject.js');
const { findNeedle } = require('../../utility/array-helpers.js');
const Schema = mongoose.Schema;

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

module.exports = semesterSchema;

