const mongoose = require('mongoose');

function updateAncestorsLastModified() {
    if (this.parent) {
        doc = this.parent();
        doc.updateLastModified();
        doc.updateAncestorsLastModified();
    }
}

function updateLastModified() {
    this.lastModified = new Date();
}

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

function updateRelevantLastModifieds() {
    this.updateAncestorsLastModified();
    this.updateLastModified();
    this.updateDescendantsLastModified()
}

module.exports = {
    updateAncestorsLastModified: updateAncestorsLastModified,
    updateLastModified: updateLastModified,
    genUpdateDescendantsLastModified: genUpdateDescendantsLastModified,
    updateRelevantLastModifieds: updateRelevantLastModifieds
}