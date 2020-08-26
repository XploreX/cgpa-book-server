const mongoose = require('mongoose');
const semesterSchema = require('./semester.js');
const {uniqueKeyVal} = require('../../utility/validation-helpers.js');
const {getAbbreviation , getTitleForm} = require('../../utility/string-helpers');

const Schema = mongoose.Schema;

var branchSchema = new Schema({
    branch : {
        type : String,
        trim : true,
        minlength : 1,
    },
    abbreviation : {
        type : String,
        trim : true ,
        minlength : 1
    },
    semesters : [semesterSchema],
    lastModified : {
        type : Date
    },
    lastListModification : {
        type : String
    }
});

branchSchema.path('semesters').validate(uniqueKeyVal('semester'),"Semester already exists","Value Error");

branchSchema.pre('validate',function(next) {
    this.branch = getTitleForm(this.branch);
    if(!this.abbreviation) {
        this.abbreviation = getAbbreviation(this.branch);
    }
    next();
})

branchSchema.methods.getSemester = function(semesterNumber) {
    for(let semester of this.semesters ) {
        if(semester.semester == semesterNumber) {
            return semester;
        }
    }
    return null;
}

branchSchema.methods.semesterID = function(semesterNumber) {
    for(let semester of this.semesters) {
        if(semester.semester == semesterNumber) {
            return semester._id;
        }
    }
    return -1;
}

module.exports = branchSchema