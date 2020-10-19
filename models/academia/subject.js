const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const __ROOT = require(__dirname + '/../../config.js').__ROOT;
const utility = require(__ROOT + '/utility');

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

subjectSchema.methods.updateAncestorsLastModified = utility.mongoose.updateAncestorsLastModified;
subjectSchema.methods.updateLastModified = utility.mongoose.updateLastModified;
subjectSchema.methods.updateDescendantsLastModified = utility.mongoose.genUpdateDescendantsLastModified();
subjectSchema.methods.updateRelevantLastModifieds = utility.mongoose.updateRelevantLastModified;
subjectSchema.methods.getLastModified = utility.mongoose.getLastModified;

module.exports = subjectSchema;