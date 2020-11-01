function uniqueKeyVal(key) {
    return function uniqueKeyValHelper(arr) {
        for (let i = 0; i < arr.length; ++i) {
            for(let j=i+1;j<arr.length;++j) {
                if(arr[i].key === arr[j].key)
                    return false;
            }
        }
        return true;
    }
}

module.exports = uniqueKeyVal;