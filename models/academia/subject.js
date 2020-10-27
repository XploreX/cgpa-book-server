const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');

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

subjectSchema.methods.updateAncestorsLastModified = utility.mongooseUtil.updateAncestorsLastModified;
subjectSchema.methods.updateLastModified = utility.mongooseUtil.updateLastModified;
subjectSchema.methods.updateDescendantsLastModified = utility.mongooseUtil.genUpdateDescendantsLastModified();
subjectSchema.methods.updateRelevantLastModifieds = utility.mongooseUtil.updateRelevantLastModified;
subjectSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;

module.exports = subjectSchema;