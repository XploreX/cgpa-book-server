const express = require('express');
const {StatusCodes} = require('http-status-codes');

const ROOT = require(__dirname + '/../../config').ROOT;
const authenticateUser = require(ROOT + '/middlewares/authenticateUser');
const {User} = require(ROOT + '/models/user');
const utility = require(ROOT + '/utility');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/gpa-data', authenticateUser, (req, res, next) => {
  User.findOne({email: req.user.email})
      .select('-_id -__v')
      .exec()
      .then((user) => {
        if (user === null) {
          user = {};
        }
        res.status(StatusCodes.OK).json(user);
      })
      .catch(next);
});
router.post('/gpa-data', authenticateUser, (req, res, next) => {
  req.body.email = req.user.email;
  User.findOne({email: req.user.email})
      .exec()
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

module.exports = router;
