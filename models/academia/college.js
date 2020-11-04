const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROOT = require(__dirname + "/../../config").ROOT;
const courseSchema = require("./course");
const utility = require(ROOT + "/utility");

var collegeSchema = new Schema(
    {
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
            minlength: 1,
        },
        courses: [courseSchema],
        createdAt : {
            type : 'Date',
            default : Date.now
        },
        updatedAt : {
            type : 'Date',
            default : Date.now
        },
        lastListModification: {
            type: Date,
            default: Date.now,
        },
    },
);

collegeSchema
    .path("courses")
    .validate(
        utility.mongooseUtil.validators.uniqueKeyVal("course"),
        "Course already exists",
        "Value Error"
    );

collegeSchema.pre('validate', function (next) {
    // this.college = getTitleForm(this.college);
    if (!this.abbreviation) {
        this.abbreviation = utility.stringUtil.getAbbreviation(this.college);
    }
    next();
});

collegeSchema.methods.addToList = function (course) {
    this.courses.push(course);
    this.lastListModification = new Date();
};

collegeSchema.methods.courseId = function (courseName) {
    for (let course of this.courses) {
        if (course.course.match(courseName)) {
            return course._id;
        }
    }
    return -1;
};

collegeSchema.methods.getCourse = function (courseName) {
    if (courseName instanceof RegExp) {
        for (let course of this.courses) {
            if (course.course.match(courseName)) {
                return course;
            }
        }
    } else {
        return utility.arrayUtil.findNeedle(this.courses, courseName, 'course',true);
    }
    return null;
};


collegeSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
collegeSchema.methods.getLastListModification =
    utility.mongooseUtil.getLastListModification;

module.exports = collegeSchema;
