const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');

var collegeHeaderSchema = new Schema({
    lastListModification : {
        type : Date,
        required : true
    }
},{
    timestamps : true
})

collegeHeaderSchema.methods.getLastListModification = utility.mongooseUtil.getLastListModification;
collegeHeaderSchema.statics.updateLastListModification = function (){
    this.find()
}

module.exports = collegeHeaderSchema;