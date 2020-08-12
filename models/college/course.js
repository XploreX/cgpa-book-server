const mongoose = require('mongoose');
const branchSchema = require('./branch.js');
const Schema = mongoose.Schema;

var courseSchema = new Schema({
    'course': {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    'branches' : [branchSchema]
});

module.exports = courseSchema;