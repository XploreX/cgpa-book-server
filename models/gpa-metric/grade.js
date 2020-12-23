const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  grade: {
    type: String,
    required: true,
    minlength: 1,
  },
  credits: {
    type: Number,
    required: true,
  },
  lastModified: {
    type: Date,
  },
});

module.exports = gradeSchema;
