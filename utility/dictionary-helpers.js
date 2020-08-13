const {getICRegexString} = require('./string-helpers');

function updateToIgnorecase(data) {
    for(key in data) {
        if(typeof data[key] == "string") {
            data[key] = getICRegexString(data[key],'i');
        }
    }
}

module.exports = {
    updateToIgnorecase : updateToIgnorecase
}