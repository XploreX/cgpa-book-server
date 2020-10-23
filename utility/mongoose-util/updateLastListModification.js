function updateLastListModification(arr) {
    let current = new Date();
    for(let item of arr) {
        item.lastListModification = current;
    }
}

module.exports = updateLastListModification;