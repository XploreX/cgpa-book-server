const mongoose = require('mongoose');
const subjectSchema = require('./subject.js');
const Schema = mongoose.Schema;

var semesterSchema = new Schema({
    'semester' : {
        type : Number,
        required : true,
    },
    'subjects' : [subjectSchema]
});

module.exports = semesterSchema;

