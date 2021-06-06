const jwt = require("jsonwebtoken");

const { syncError } = require("../utility/errors");

const { SECRETKEY } = require("../constants/constant");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    syncError("Not authenticated.", 401);
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRETKEY);
  } catch (err) {
    syncError(err, 500);
  }
  if (!decodedToken) {
    syncError("Not authenticated.", 401);
  }
  req.userId = decodedToken.userId;
  next();
};
