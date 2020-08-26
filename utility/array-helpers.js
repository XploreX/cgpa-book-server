function findNeedle(haystack, needle, ignorecase = false,key = null) {  //Should only be used on list consisting of just strings or list of objects whose key attribute have string value
    if(ignorecase) {
        needle = needle.toLowerCase();
    }
    for (let hay of haystack) {
        let hayValue = hay;
        if (key)
            hayValue = hay[key];
        if (ignorecase) {
            if (hayValue.toLowerCase() == needle) {
                return hay;
            }
        }
        else {
            if(hayValue == needle) {
                return hay;
            }
        }
    }
    return null;
}

module.exports = {
    findNeedle : findNeedle
}