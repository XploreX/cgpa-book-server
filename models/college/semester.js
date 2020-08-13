const mongoose = require('mongoose');
const subjectSchema = require('./subject.js');
const Schema = mongoose.Schema;

var semesterSchema = new Schema({
    'semester' : {
        type : Number,
        required : true,
        unique : true
    },
    'subjects' : [subjectSchema]
});

semesterSchema.methods.getSubject = function(subjectName) {
    for(subject of this.subjects) {
        if(subject.subject.match(subjectName)) {
            return subject;
        }
    }
    return null;
}

semesterSchema.methods.subjectID = function(subjectName) {
    for(subject of this.subjects) {
        if(subject.subject.match(subjectName)) {
            return subject._id;
        }
    }
    return -1;
}

module.exports = semesterSchema;

