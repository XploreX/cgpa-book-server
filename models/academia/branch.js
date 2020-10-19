const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const __ROOT = require(__dirname + '/../../config.js').__ROOT;
const utility = require(__ROOT + '/utility');
const semesterSchema = require('./semester.js');

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
        type : Date
    }
});

branchSchema.path('semesters').validate(utility.mongoose.validators.uniqueKeyVal('semester'),"Semester already exists","Value Error");

branchSchema.pre('validate',function(next) {
    // this.branch = getTitleForm(this.branch);
    if(!this.abbreviation) {
        this.abbreviation = utility.string.getAbbreviation(this.branch);
    }
    next();
})

branchSchema.pre('save',function(next) {
    next();
})

branchSchema.methods.addToList = function (semester) {
    this.semesters.push(semester);
    this.lastListModification = new Date();
}

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

branchSchema.methods.updateAncestorsLastModified = utility.mongoose.updateAncestorsLastModified;
branchSchema.methods.updateLastModified = utility.mongoose.updateLastModified;
branchSchema.methods.updateDescendantsLastModified = utility.mongoose.genUpdateDescendantsLastModified('semesters');
branchSchema.methods.updateRelevantLastModifieds = utility.mongoose.updateRelevantLastModifieds;
branchSchema.methods.getLastModified = utility.mongoose.getLastModified;
branchSchema.methods.getLastListModification = utility.mongoose.getLastListModification;

module.exports = branchSchema