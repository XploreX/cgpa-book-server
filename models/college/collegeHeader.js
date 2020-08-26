const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var collegeHeaderSchema = new Schema({
    lastListModification : {
        type : Date
    }
})

module.exports = collegeHeaderSchema;