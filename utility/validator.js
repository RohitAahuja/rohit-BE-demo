const { body } = require("express-validator");
const Customer = require("../models/customer");
const User = require("../models/user");

exports.customerValidator = () => {
  return [
    body("name").trim().isString(),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email id!!!"),
    body("address")
      .trim()
      .isString()
      .withMessage("Please enter a valid email address!!!"),
    body("city")
      .trim()
      .isString()
      .withMessage("Please enter a valid city name!!!"),
  ];
};

exports.emailAlreadyPresentValidator = () => {
  return body("email").custom((value, { req }) => {
    return Customer.findOne({ email: value }).then((customer) => {
      if (customer) {
        return Promise.reject("E-mail address already exists!");
      }
    });
  });
};

exports.loginValidator = () => {
  return [
    body("email", "Please enter a valid email!!!").trim().notEmpty().isEmail(),
    body("password", "Please enter a valid password!!!")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 character long!!!")
      .isAlphanumeric(),
  ];
};

exports.signUpValidator = () => {
  return [
    body("userName")
      .trim()
      .notEmpty()
      .withMessage("Please enter a valid userName!!!")
      .isString(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!!!")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((usr) => {
          if (usr) {
            return Promise.reject(
              "This emailId is already present, please try again with any other emailId!!!"
            );
          }
        });
      }),
    body("phone", "Phone number must be numeric and 10 digits!!!")
      .trim()
      .notEmpty()
      .withMessage()
      .isLength({ max: 10, min: 10 }),
    // .isMobilePhone(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter a valid password!!!")
      .isString(),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("Please enter a confirm password!!!")
      .isString()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return Promise.reject(
            "Password and Confirm Password should be matched!!!"
          );
        } else {
          return true;
        }
      }),
  ];
};
