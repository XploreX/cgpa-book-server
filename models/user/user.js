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
        trim : true,
    },
    course : {
        type : 'String',
        trim : true,
    },
    branch : {
        type : 'String',
        trim : true,
    },
    unlocked : {
        type : 'Number'
    },
    semesters : {}
},{
    timestamps : true
});

module.exports = userSchema;

