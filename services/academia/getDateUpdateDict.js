const ROOT = require(__dirname + '/../../config').ROOT;
const academiaFields = require(ROOT + '/fields/academia');

function getDateUpdateDict(i,j) {
    d = {
        [academiaFields.TS_UPDATED_AT] : true
    }
    if(typeof i === 'string'){
        d['courses.$['+i+'].'+academiaFields.TS_UPDATED_AT] = true;
        if(typeof j === 'string') {
            d['courses.$['+i+'].branches.$['+j+'].'+academiaFields.TS_UPDATED_AT] = true
        }
    }
    return d;
}
console.log(getDateUpdateDict());
console.log(getDateUpdateDict('i'));
console.log(getDateUpdateDict('i','j'));

module.exports = getDateUpdateDict;