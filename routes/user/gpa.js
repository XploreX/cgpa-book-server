const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const authenticateUser = require(ROOT + '/middlewares/authenticateUser');
const {User} = require(ROOT + '/models/user');
const utility = require(ROOT + '/utility');
const userServices = require(ROOT + '/services/user');
const userFields = require(ROOT + '/fields/user');
const CustomError = require(ROOT + '/CustomError');
// eslint-disable-next-line new-cap
const router = express.Router();
router.get('/gpa-data', authenticateUser, (req, res, next) => {
  User.findOne({email: req.user.email})
      .select('-_id -__v')
      .exec()
      .then((user) => {
        if (user === null) {
          return {};
        } else {
          return userServices.replaceAcademiaIdsWithValues(user.toObject());
        }
      })
      .then((user) => {
        res.status(StatusCodes.OK).json(user);
      })
      .catch(next);
});

router.post('/gpa-data', authenticateUser, (req, res, next) => {
  userServices
      .replaceAcademiaValuesWithIds(req.body)
      .then(() => {
        req.body.email = req.user.email;
        return User.findOne({email: req.user.email}).exec();
      })
      .then((user) => {
        if (user === null) {
          user = new User(req.body);
        } else {
          user.overwrite(req.body);
        }
        user.markModified('semesters');
        return user.save();
      })
      .then((doc) => {
        res
            .status(StatusCodes.OK)
            .send(utility.responseUtil.getSuccessResponse());
      })
      .catch(next);
});

router.delete('/gpa-data', authenticateUser, (req, res, next) => {
  User.deleteOne({
    [userFields.EMAIL]: req.user.email,
  })
      .then((queryRes) => {
        if (queryRes.deletedCount) {
          res
              .status(StatusCodes.OK)
              .json(utility.responseUtil.getSuccessResponse());
        } else {
          throw new CustomError(
              'Nothing to delete, user data do not exist',
              StatusCodes.NOT_FOUND,
          );
        }
      })
      .catch(next);
});
module.exports = router;
