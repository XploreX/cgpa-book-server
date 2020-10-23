const mongoose = require('mongoose');

const ROOT = require(__dirname + '/../../config.js').ROOT;
const utility = require(ROOT + '/utility');
const branchSchema = require('./branch.js');
const {findNeedle} = require(__dirname + '/../../utility/array-util.js');

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
    lastModified: {
        type: Date
    },
    lastListModification: {
        type: Date
    }
});

courseSchema.path('branches').validate(utility.mongooseUtil.validators.uniqueKeyVal('branch'), "Branch already exists", "Value Error");

courseSchema.pre('validate', function (next) {
    // this.course = stringHelpers.getTitleForm(this.course);
    next();
})

courseSchema.pre('save',function(next) {
    next();
})

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
        return findNeedle(this.branches,branchName,true,'branch');
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

courseSchema.methods.updateAncestorsLastModified = utility.mongooseUtil.updateAncestorsLastModified;
courseSchema.methods.updateLastModified = utility.mongooseUtil.updateLastModified;
courseSchema.methods.updateDescendantsLastModified = utility.mongooseUtil.genUpdateDescendantsLastModified('branches');
courseSchema.methods.updateRelevantLastModifieds = utility.mongooseUtil.updateRelevantLastModifieds;
courseSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;
courseSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;

module.exports = courseSchema;