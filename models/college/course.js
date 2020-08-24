const mongoose = require('mongoose');
const branchSchema = require('./branch.js');
const stringHelpers = require('../../utility/string-helpers.js');
const Schema = mongoose.Schema;

var courseSchema = new Schema({
    'course': {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    'branches' : [branchSchema],
    'gpaMetric' : {
        type : String,
        trim : true,
        minlength : 1
    },
    'lastModified' : {
        type : Date
    }
});

courseSchema.methods.getBranch = function(branchName) {
    for(let branch of this.branches) {
        if(branch.branch.match(branchName)) {
            return branch;
        }
    }
    return null;
}

courseSchema.methods.branchID = function(branchName) {
    for(let branch of this.branches) {
        if(branch.branch.match(branchName)) {
            return branch._id;
        }
    }
    return -1;
}

module.exports = courseSchema;