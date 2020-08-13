function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function getICRegexString(str) {
    return new RegExp(str,'i');
}

function getAbbreviation(str) {
    let line = str.split(' ');
    let s = "";
    for(let word of line) {
        s += word[0].toUpperCase();
    }
    return s;
}

module.exports = {
    capitalizeFirstLetter  : capitalizeFirstLetter,
    getICRegexString : getICRegexString,
    getAbbreviation : getAbbreviation
}