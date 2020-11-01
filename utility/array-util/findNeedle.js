function findNeedle(haystack, needle, key = null,ignorecase = false) {  //Should only be used on list consisting of just strings or list of objects whose key attribute have string value
    if (ignorecase) {
        needle = needle.toLowerCase();
    }
    for (let hay of haystack) {
        let hayValue = hay;
        if (key)
            hayValue = hay[key];
        if (ignorecase)
            hayValue = hayValue.toLowerCase();
        if (hayValue === needle) {
            return hay;
        }
    }
    return null;
}

module.exports = findNeedle;