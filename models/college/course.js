const mongoose = require('mongoose');
const branchSchema = require('./branch.js');
const Schema = mongoose.Schema;

var courseSchema = new Schema({
    'course': {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    'branches' : [branchSchema]
});

courseSchema.methods.getBranch = function(branchName) {
    for(branch of this.branches) {
        if(branch.branch == branchName) {
            return branch;
        }
    }
    return null;
}

courseSchema.methods.branchID = function(branchName) {
    for(branch of this.branches) {
        if(branch.branch == branchName) {
            return branch._id;
        }
    }
    return -1;
}

module.exports = courseSchema;