function updateLastModifed(arr) {
    let current = new Date();
    for (let item of arr) {
        item.lastModified = current;
    }
}

module.exports = {
    updateLastModifed : updateLastModifed
}