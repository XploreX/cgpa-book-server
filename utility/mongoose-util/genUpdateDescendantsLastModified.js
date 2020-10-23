function genUpdateDescendantsLastModified(key) {
    return function () {
        if(! key)
            return;
        for (elem of this[key]) {
            elem.updateLastModified();
            elem.updateDescendantsLastModified();
        }
    }
}

module.exports = genUpdateDescendantsLastModified;