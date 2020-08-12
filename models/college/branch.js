const mongoose = require('mongoose');
const semesterSchema = require('./semester.js');
const Schema = mongoose.Schema;

var branchSchema = new Schema({
    'branch' : {
        type : String,
        trim : true,
        minlength : 1
    },
    'semesters' : [semesterSchema]
});

module.exports = branchSchema