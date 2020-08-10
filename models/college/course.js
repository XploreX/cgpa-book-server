const mongoose = require('mongoose');
const semesterSchema = require('./semester.js');
const Schema = mongoose.Schema;

var courseSchema = new Schema({
    'course': {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    'semesters': [semesterSchema]
});

module.exports = courseSchema;