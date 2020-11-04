const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROOT = require(__dirname + "/../../config").ROOT;
const utility = require(ROOT + "/utility");

var subjectSchema = new Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  subjectCode: {
    type: String,
    trim: true,
    default: null,
  },
  credits: {
    type: Number,
    required: true,
  },
},{
  timestamps : true
});


subjectSchema.methods.getLastModified = utility.mongooseUtil.getLastModified;

module.exports = subjectSchema;
