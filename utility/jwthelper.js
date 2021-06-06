const jwt = require("jsonwebtoken");

const { SECRETEKEY, EXPIRYTIME } = require("../constants/constant");

exports.createJwtToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    SECRETEKEY,
    { expiresIn: EXPIRYTIME }
  );
};
