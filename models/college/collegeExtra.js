const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var collegeExtraSchema = new Schema({
    lastListModification : {
        type : Date
    }
})

module.exports = collegeExtraSchema;