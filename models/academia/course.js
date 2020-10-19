const mongoose = require('mongoose');
const branchSchema = require('./branch.js');
const stringHelpers = require('../../utility/string-util.js');
const { uniqueKeyVal } = require('../../utility/validation-util.js')
const {findNeedle} = require('../../utility/array-helpers.js');
const mongoHelpers = require('../../utility/mongo-util.js');
const collegeHelpers = require('./college-helpers.js');

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

courseSchema.path('branches').validate(uniqueKeyVal('branch'), "Branch already exists", "Value Error");

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

courseSchema.methods.updateAncestorsLastModified = collegeHelpers.updateAncestorsLastModified;
courseSchema.methods.updateLastModified = collegeHelpers.updateLastModified;
courseSchema.methods.updateDescendantsLastModified = collegeHelpers.genUpdateDescendantsLastModified('branches');
courseSchema.methods.updateRelevantLastModifieds = collegeHelpers.updateRelevantLastModifieds;


courseSchema.methods.getLastModified = mongoHelpers.getLastModified;
courseSchema.methods.getLastListModification = mongoHelpers.getLastListModification;

module.exports = courseSchema;