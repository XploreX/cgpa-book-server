function updateAncestorsLastModified() {
    if (this.parent) {
        doc = this.parent();
        doc.updateLastModified();
        doc.updateAncestorsLastModified();
    }
}

module.exports = updateAncestorsLastModified;