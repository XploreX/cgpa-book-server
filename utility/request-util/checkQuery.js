function checkQuery(query,keys) {
    for( key of keys) {
        if(!(key in query)) {
            let err = new Error("Required '" + key +"' attribute not present in query");
            err.name = "TypeError";
            throw err;
        }
    }
}

module.exports = checkQuery;