const mongoose = require('mongoose');
const courseSchema = require('./course.js');
const Schema = mongoose.Schema;

var collegeSchema = new Schema({
    college : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true ,
    },
    nameShort : {
        type : String,
        trim : true ,
        minlength : 1
    },
    courses : [courseSchema]
});

collegeSchema.methods.courseID = function (courseName) {
    for(course of this.courses) {
        if(course.course.match(courseName))
        {
            return course._id;
        }
    }
    return -1;
}

collegeSchema.methods.getCourse = function(courseName) {
    for(course of this.courses) {
        if(course.course.match(courseName)) {
            return course;
        }
    }
    return null
}

module.exports = collegeSchema;