const academiaConsts = require('../routers/academia-constants.js');

function updateLastModifed(arr) {
    let current = new Date();
    for (let item of arr) {
        item.lastModified = current;
    }
}

function updateLastListModification(arr) {
    let current = new Date();
    for(let item of arr) {
        item.lastListModification = current;
    }
}

function checkExistance(obj,key) {
    if(! obj) {
        let err= new Error(key + " not found");
        err.name = 'ValueError';
        throw err;
    }
}

function checkQuery(query,keys) {
    for( key of keys) {
        if(!(key in query)) {
            let err = new Error("Required '"+key+"' attribute not present in query");
            err.name = "TypeError";
            throw err;
        }
    }
}

function addMissingKeysToQuery(query,keys) {    //Semester not handled here yet , semester is a number , so missing semester can not be dealt the way other query attributes are dealt here using RegExp
    for(key of keys) {
        if(!(key in query)) {
            query[key] = new RegExp('');
        }
    }
}

module.exports = {
    updateLastModifed : updateLastModifed,
    updateLastListModification : updateLastListModification,
    checkExistance : checkExistance,
    checkQuery : checkQuery,
    addMissingKeysToQuery : addMissingKeysToQuery
}