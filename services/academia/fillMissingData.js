const ROOT = require(__dirname + '/config/app.js').ROOT;
const { College } = require(ROOT + '/Models/academia');
const CustomError = require(ROOT + '/CustomError');

function fillData(query) {
    if (typeof query['college'] !== 'string')
        return Promise.resolve(true);
    if (typeof query['course'] !== 'string')
        return Promise.resolve(true);
    let allGood = 1;
    return College.findOne({
        college: query['college'],
    })
        .exec()
        .then((doc) => {
            if (doc === null) {
                throw new CustomError("Given college don't exist", 400)
            }
            return doc;
        })
        .then(() => {
            College.updateOne(
                {
                    college: query['college'],
                    'courses.course': { '$ne': query['course'] }
                },
                {
                    $push: { courses: { course: query['course'] } }
                })
            .exec()
            .then((queryRes) => {
                if (typeof query['branch'] !== 'string') {
                    allGood = 0;
                    return Promise.resolve(queryRes);
                }
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
        })
        .then((queryRes) => {
            if (!allGood || (typeof query['semester'] !== 'string' && typeof query['semester'] !== 'number'))
                return Promise.resolve(queryRes);
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
                    $push: { 'courses.$[i].branches.$[j].semesters': { semester: query['semester'] } }
                }, {
                arrayFilters: [
                    { 'i.course': query['course'] },
                    { 'j.branch': query['branch'] }
                ]
            })
                .exec();
        })
}

module.exports = fillMissingData;