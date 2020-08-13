function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function getICRegexString(str) {
    return new RegExp(str,'i');
}

module.exports = {
    capitalizeFirstLetter  : capitalizeFirstLetter,
    getICRegexString : getICRegexString
}