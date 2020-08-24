const mongoose = require('mongoose');
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

module.exports = subjectSchema;