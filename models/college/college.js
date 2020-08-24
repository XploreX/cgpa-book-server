const mongoose = require('mongoose');
const courseSchema = require('./course.js');
const { getAbbreviation } = require('../../utility/string-helpers.js');
const Schema = mongoose.Schema;

var collegeSchema = new Schema({
    college: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
    },
    abbreviation: {
        type: String,
        trim: true,
        minlength: 1
    },
    courses: [courseSchema],
    lastModified : {
        type : Date
    }
});

collegeSchema.pre('save', function (next) {
    if (!this.abbreviation) {
        this.abbreviation = getAbbreviation(this.college);
    }
    next();
})

collegeSchema.methods.courseID = function (courseName) {
    for (let course of this.courses) {
        if (course.course.match(courseName)) {
            return course._id;
        }
    }
    return -1;
}

collegeSchema.methods.getCourse = function (courseName) {
    for (let course of this.courses) {
        if (course.course.match(courseName)) {
            return course;
        }
    }
    return null
}

module.exports = collegeSchema;