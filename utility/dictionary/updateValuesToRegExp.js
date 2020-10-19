function updateValuesToRegExp(data, flags) {
    for (key in data) {
        if (typeof data[key] === "string") {
            data[key] = new RegExp(data[key], flags);
        }
    }
}

module.exports = updateValuesToRegExp;