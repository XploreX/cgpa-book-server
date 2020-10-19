function prepareQuery(data, flags) {
    for (key in data) {
        // console.log(key);
        if (typeof data[key] === "string") {
            // console.log(key + " is string");
            data[key] = data[key].replace('(', '\\(');
            data[key] = data[key].replace(')', '\\)');
            data[key] = new RegExp(data[key], flags);
            // console.log(data[key]);
        }
    }
}

module.exports = prepareQuery;