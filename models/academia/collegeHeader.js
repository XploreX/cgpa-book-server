const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config.js').ROOT;
const utility = require(ROOT + '/utility');

var collegeHeaderSchema = new Schema({
    lastListModification : {
        type : Date
    }
})

collegeHeaderSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;

module.exports = collegeHeaderSchema;