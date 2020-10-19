const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const __ROOT = require(__dirname + '/../../config.js').__ROOT;
const utility = require(__ROOT + '/utility');

var collegeHeaderSchema = new Schema({
    lastListModification : {
        type : Date
    }
})

collegeHeaderSchema.methods.getLastListModification = utility.mongoose.getLastListModification;

module.exports = collegeHeaderSchema;