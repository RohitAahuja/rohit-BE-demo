const { body } = require("express-validator");
const Customer = require("../models/customer");

exports.customerValidator = () => {
    return [
      body('name').trim().isString(),
      body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email id!!!'),
      body("address").trim().isString().withMessage('Please enter a valid email address!!!'),
      body("city").trim().isString().withMessage('Please enter a valid city name!!!'),
    ];
  };

  exports.emailAlreadyPresentValidator = () => {
    return body("email")
        .custom((value, { req }) => {
          return Customer.findOne({ email: value })
            .then((customer) => {
              if (customer) {
                return Promise.reject("E-mail address already exists!");
              }
            })
        })
  };

// module.exports = customerValidator;