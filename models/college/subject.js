const mongoose = require('mongoose');
const stringHelpers = require('../../utility/string-helpers.js');

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
    this.subject = stringHelpers.getTitleForm(this.subject);
    next();
})

module.exports = subjectSchema;