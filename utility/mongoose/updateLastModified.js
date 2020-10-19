/* function updateLastModifed(arr) {
    let current = new Date();
    for (let item of arr) {
        item.lastModified = current;
    }
} */

function updateLastModified() {
    this.lastModified = new Date();
}

module.exports = updateLastModifed;