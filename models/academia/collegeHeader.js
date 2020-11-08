const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ROOT = require(__dirname + '/../../config').ROOT;
const utility = require(ROOT + '/utility');

var collegeHeaderSchema = new Schema({
    lastListModification: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
})

collegeHeaderSchema.statics.getLastListModification = function () {
    return this.findOne().exec()
        .then((doc) => {
            if(doc) 
            {
                // console.log(doc);
                return doc.lastListModification.toUTCString();
            }
            else return Date.now().toUTCString();
        })
};
collegeHeaderSchema.statics.updateLastListModification = function () {
    return this.updateOne({}, { $set: { lastListModification: Date.now() } }, { upsert: true }).exec();
}

module.exports = collegeHeaderSchema;