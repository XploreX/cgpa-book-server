const ROOT = require(__dirname + '/config/app.js').ROOT;
const {College} = require(ROOT + '/Models/academia');

function fillData(query) {
    if(typeof query['college'] !== 'string')
        return Promise.resolve(true);
    if(typeof query['course'] !== 'string')
        return Promise.resolve(true);
    return College.updateOne(
        {
            college: query['college'],
            'courses.course': { '$ne': query['course'] }
        },
        {
            $push: { courses: { course: query['course'] } }
        })
        .exec()
        .then(() => {
            if(typeof query['branch'] !== 'string')
                return Promise.resolve(true);
            return College.updateOne(
                {
                    college: query['college'],
                    'courses': {
                        $elemMatch: {
                            course: query['course'],
                            'branches.branch': { $ne: query['branch'] }
                        }
                    }
                },
                {
                    $push: {
                        'courses.$.branches': {
                            branch: query['branch'],
                            abbreviation: utility.stringUtil.getAbbreviation(query['branch'])
                        }
                    }
                }
            )
                .exec();
        })
        .then(() => {
            if((typeof query['semester'] !== 'string' && typeof query['semester'] !== 'number'))
                return Promise.resolve(true);
            return College.updateOne(
                {
                    college: query['college'],
                    courses: {
                        $elemMatch: {
                            course: query['course'],
                            'branches': {
                                $elemMatch: {
                                    'branch': query['branch'],
                                    'semesters.semester': { $ne: query['semester'] }
                                }
                            }
                        }
                    }
                },
                {
                    $push: { 'courses.$[i].branches.$[j].semesters':{semester : query['semester'] } }
                }, {
                arrayFilters: [
                    { 'i.course': query['course'] },
                    { 'j.branch': query['branch'] }
                ]
            })
                .exec();
        })
}

module.exports = fillData;