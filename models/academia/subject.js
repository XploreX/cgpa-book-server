const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');

const subjectSchema = new Schema({
  subject: {
    type: String,
    required: false,
    trim: true,
  },
  subjectNameHistory: [String],
  subjectId: mongoose.Types.ObjectId,
  subjectCode: {
    type: String,
    trim: true,
    default: null,
  },
  credits: {
    type: Number,
    required: true,
  },
});

subjectSchema.methods.getLastModified =
  utility.mongooseUtil.getLastModified;

module.exports = subjectSchema;
