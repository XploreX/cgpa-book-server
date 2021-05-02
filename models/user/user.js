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
      college: {
        type: 'String',
        trim: true,
      },
      course: {
        type: 'String',
        trim: true,
      },
      branch: {
        type: 'String',
        trim: true,
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
