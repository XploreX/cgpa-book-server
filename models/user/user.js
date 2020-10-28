const mongoose = require('mongoose');

const ROOT = require(__dirname + '/../../config').ROOT;

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email : {
        type : 'String',
        required : true,
        trim : true,
        minlength : 1
    },
    college : {
        type : 'String',
        required : true,
        trim : true,
        minlength : 1
    },
    course : {
        type : 'String',
        required : true,
        trim : true,
        minlength : 1
    },
    branch : {
        type : 'String',
        required : true,
        trim : true,
        minLength : 1
    },
    semesters : {}
});

module.exports = userSchema;

