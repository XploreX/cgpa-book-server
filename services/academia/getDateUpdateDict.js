const ROOT = require(__dirname + '/../../config/app').ROOT;
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

module.exports = getDateUpdateDict;