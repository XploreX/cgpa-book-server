function uniqueKeyVal(key) {
    return function uniqueKeyValHelper(arr) {
        let last = arr[arr.length - 1];
        for (let i = 0; i < arr.length - 1; ++i) {
            if (arr[i][key] === last[key]) {
                return false;
            }
        }
    }
}

module.exports = uniqueKeyVal;