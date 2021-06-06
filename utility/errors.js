// const { validationResult } = require("express-validator");

exports.asyncError = (err, next, errCode) => {
  // console.log('err', err)
  const error = new Error(err);
  error.statusCode = errCode || 500;
  next(error);
};

exports.syncError = (err, errCode) => {
    const error = new Error(err);
    error.statusCode = errCode || 500;
    throw error;
}

// exports.validateForErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       message: errors.errors[0].msg,
//       // errors: errors.array(),
//     });
//   }
// };
