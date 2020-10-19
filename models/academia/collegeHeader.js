const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoHelpers = require('../../utility/mongo-helpers.js');

var collegeHeaderSchema = new Schema({
    lastListModification : {
        type : Date
    }
})

collegeHeaderSchema.methods.getLastListModification = mongoHelpers.getLastListModification;

module.exports = collegeHeaderSchema;