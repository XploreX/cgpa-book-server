const mongoose = require('mongoose');
const semesterSchema = require('./semester.js');
const Schema = mongoose.Schema;

var branchSchema = new Schema({
    'branch' : {
        type : String,
        trim : true,
        minlength : 1,
        unique : true
    },
    nameShort : {
        type : String,
        trim : true ,
        minlength : 1
    },
    'semesters' : [semesterSchema]
});

branchSchema.methods.getSemester = function(semesterNumber) {
    for(semester of this.semesters ) {
        if(semester.semester == semesterNumber) {
            return semester;
        }
    }
    return null;
}

branchSchema.methods.semesterID = function(semesterNumber) {
    for(semester of this.semesters) {
        if(semester.semester == semesterNumber) {
            return semester._id;
        }
    }
    return -1;
}

module.exports = branchSchema