const mongoose = require('mongoose');
const courseSchema = require('./course.js');
const Schema = mongoose.Schema;

var collegeSchema = new Schema({
    'college' : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    },
    'courses' : [courseSchema]
});

module.exports = collegeSchema;