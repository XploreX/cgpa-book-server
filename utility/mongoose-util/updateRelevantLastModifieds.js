function updateRelevantLastModifieds() {
    this.updateAncestorsLastModified();
    this.updateLastModified();
    this.updateDescendantsLastModified()
}

module.exports = updateRelevantLastModifieds;