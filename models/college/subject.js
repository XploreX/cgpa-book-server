const mongoose = require('mongoose');
const stringHelpers = require('../../utility/string-helpers.js');
const mongoHelpers = require('../../utility/mongo-helpers.js');
const collegeHelpers = require('./college-helpers.js');
const Schema = mongoose.Schema;

var subjectSchema = new Schema({
    subject : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
    },
    subjectCode : {
        type : String ,
        trim : true,
        default : null
    },
    credits : {
        type : Number,
        required : true
    },
    lastModified : {
        type : Date
    }
});

subjectSchema.pre('validate',function(next) {
    // this.subject = stringHelpers.getTitleForm(this.subject);
    next();
})

subjectSchema.pre('save',function(next) {
    next();
})

subjectSchema.methods.updateAncestorsLastModified = collegeHelpers.updateAncestorsLastModified;
subjectSchema.methods.updateLastModified = collegeHelpers.updateLastModified;
subjectSchema.methods.updateDescendantsLastModified = collegeHelpers.genUpdateDescendantsLastModified();
subjectSchema.methods.updateRelevantLastModifieds = collegeHelpers.updateRelevantLastModified;


subjectSchema.methods.getLastModified = mongoHelpers.getLastModified;

module.exports = subjectSchema;