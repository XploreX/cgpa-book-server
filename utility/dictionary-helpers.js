const { getICRegexString } = require('./string-helpers');

function updateValuesToIgnorecase(data) {
    for (key in data) {
        if (typeof data[key] == "string") {
            data[key] = getICRegexString(data[key], 'i');
        }
    }
}

function updateValuesToRegExp(data, flags) {
    for (key in data) {
        if (typeof data[key] == "string") {
            data[key] = new RegExp(data[key], flags);
        }
    }
}

function prepareQuery(data, flags) {
    for (key in data) {
        if (typeof data[key] == "string") {
            data[key] = data[key].replace('(', '\\(');
            data[key] = data[key].replace(')', '\\)');
            data[key] = new RegExp(data[key], flags);
        }
    }
}


module.exports = {
    updateValuesToIgnorecase: updateValuesToIgnorecase,
    updateValuesToRegExp: updateValuesToRegExp,
    prepareQuery: prepareQuery,
}