const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const { createJwtToken } = require("../utility/jwthelper");
const { asyncError } = require("../utility/errors");
const { sendEmail } = require("../utility/emailHelper");

const {
  USERCREATEDSUCCESS,
  INVALIDEMAILPWD,
  LOGINSUCCESS,
} = require("../constants/constant");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.errors[0].msg,
      // errors: errors.array(),
    });
  }
  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPwd) => {
      const user = new User({
        ...req.body,
        password: hashedPwd,
      });
      return user.save();
    })
    .then(() => {
      sendEmail(req, `Hi ${req.body.userName}, Your signup is successful!!!`);
      return res.status(201).json({ message: USERCREATEDSUCCESS });
    })
    .catch((err) => {
      return asyncError(err, next);
    });
};

exports.login = (req, res, next) => {
  // validate for any errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.errors[0].msg,
      // errors: errors.array(),
    });
  }

  let loadedUser;
  User.findOne({ email: req.body.email })
    .then((usr) => {
      if (!usr) {
        return res.status(401).json({ message: INVALIDEMAILPWD });
      }
      loadedUser = usr;
      return bcrypt.compare(usr.password, req.body.password);
    })
    .then((isMatched) => {
      if (!isMatched) {
        return res.status(401).json({ message: INVALIDEMAILPWD });
      }
      const jwtToken = createJwtToken(loadedUser);
      return res.status(200).json({
        message: LOGINSUCCESS,
        jwtToken,
        userId: loadedUser._id.toString(),
      });
    });
};
