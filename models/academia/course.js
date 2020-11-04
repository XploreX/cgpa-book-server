const mongoose = require('mongoose');

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');
const branchSchema = require('./branch');

const Schema = mongoose.Schema;

var courseSchema = new Schema({
    course: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    branches: [branchSchema],
    gpaMetric: {
        type: String,
        trim: true,
        minlength: 1
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
    updatedAt: {
        type: 'Date',
        default: Date.now
    },
    lastListModification: {
        type: Date,
        default: Date.now
    }
});

courseSchema.path('branches').validate(utility.mongooseUtil.validators.uniqueKeyVal('branch'), "Branch already exists", "Value Error");


courseSchema.methods.addToList = function (branch) {
    this.branches.push(branch);
    this.lastListModification = new Date();
}

courseSchema.methods.getBranch = function (branchName) {
    if (branchName instanceof RegExp) {
        for (let branch of this.branches) {
            if (branch.branch.match(branchName)) {
                return branch;
            }
        }
    }
    else {
        return utility.arrayUtil.findNeedle(this.branches, branchName, 'branch', true);
    }
    return null;
}

courseSchema.methods.branchID = function (branchName) {
    for (let branch of this.branches) {
        if (branch.branch.match(branchName)) {
            return branch._id;
        }
    }
    return -1;
}

courseSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
courseSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;

module.exports = courseSchema;