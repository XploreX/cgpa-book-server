const mongoose = require('mongoose');
const courseSchema = require('./course.js');
const { getAbbreviation, getTitleForm } = require('../../utility/string-helpers.js');
const { uniqueKeyVal } = require('../../utility/validation-helpers');
const {findNeedle} = require('../../utility/array-helpers.js');

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
    lastModified: {
        type: Date
    },
    lastListModification: {
        type: Date
    }
});


collegeSchema.path('courses').validate(uniqueKeyVal('course'), "Course already exists", "Value Error");

collegeSchema.pre('validate', function (next) {
    // this.college = getTitleForm(this.college);
    if (!this.abbreviation) {
        this.abbreviation = getAbbreviation(this.college);
    }
    next();
})

collegeSchema.pre('save' , function(next) {
    this.lastModified = new Date();
    next();
})

collegeSchema.methods.addToList = function (course) {
    this.courses.push(course);
    this.lastListModification = new Date();
}

collegeSchema.methods.courseID = function (courseName) {
    for (let course of this.courses) {
        if (course.course.match(courseName)) {
            return course._id;
        }
    }
    return -1;
}

collegeSchema.methods.getCourse = function (courseName) {
    if (courseName instanceof RegExp) {
        for (let course of this.courses) {
            if (course.course.match(courseName)) {
                return course;
            }
        }
    }
    else {
        return findNeedle(this.courses,courseName,true,'course');
    }
    return null
}

module.exports = collegeSchema;