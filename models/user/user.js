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
        type: 'Number',
      },
      courseId: {
        type: 'Number',
      },
      branchId: {
        type: 'Number',
      },
      unlocked: {
        type: 'Number',
      },
      semesters: {},
    },
    {
      timestamps: true,
    },
);

module.exports = userSchema;
