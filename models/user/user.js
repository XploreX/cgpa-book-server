const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
      email: {
        type: 'String',
        required: true,
        trim: true,
        minlength: 1,
      },
      collegeId: {
        type: mongoose.Types.ObjectId,
      },
      courseId: {
        type: mongoose.Types.ObjectId,
      },
      branchId: {
        type: mongoose.Types.ObjectId,
      },
      unlocked: {
        type: 'Number',
      },
      rated: {
        type: 'Boolean',
      },
      semesters: {},
    },
    {
      timestamps: true,
    },
);

module.exports = userSchema;
