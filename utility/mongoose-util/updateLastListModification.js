/**
 *
 * @param {Array} arr
 *
 */
function updateLastListModification(arr) {
  const current = new Date();
  for (const item of arr) {
    item.lastListModification = current;
  }
}

module.exports = updateLastListModification;
