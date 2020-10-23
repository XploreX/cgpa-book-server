const mongoose = require('mongoose');
const gradeSchema = require('./grade.js');
const Schema = mongoose.Schema;

var metricSchema = new Schema({
    metricName : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true
    },
    grades : [gradeSchema]
});

module.exports = metricSchema;