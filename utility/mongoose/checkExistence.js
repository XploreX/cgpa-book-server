function checkExistance(obj,key) {
    if(! obj) {
        let err= new Error(key + " not found");
        err.name = 'ValueError';
        throw err;
    }
}

module.exports = checkExistance;