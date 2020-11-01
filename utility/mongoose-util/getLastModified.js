function getLastModified() {
    return this.createdAt.toUTCString();
}

module.exports = getLastModified;