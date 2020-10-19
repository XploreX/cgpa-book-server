function addMissingKeysToQuery(query,keys) {    //Semester not handled here yet , semester is a number , so missing semester can not be dealt the way other query attributes are dealt here using RegExp
    for(key of keys) {
        if(!(key in query)) {
            query[key] = new RegExp('');
        }
    }
}

module.exports = addMissingKeysToQuery;