const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const customer = require("../models/customer");

const Customer = require("../models/customer");
const { asyncError } = require("../utility/errors");

exports.getCustomers = (req, res, next) => {
  return Customer.find()
    .then((customers) => {
      if (!customers) {
        customers = [];
      }
      return res
        .status(200)
        .json({ message: "Customers Fetched successfully!!!", customers });
    })
    .catch((err) => asyncError(err, next));
};

exports.getCustomerById = (req, res, next) => {
  const { customerId } = req.params;
  if (customerId) {
    return Customer.findById(customerId)
      .then((customer) => {
        if (!customer) {
          return res.status(404).json({
            message: "Details of selected customer id is not present!!!",
          });
        }
        return res
          .status(200)
          .json({ message: "Customer Fetched successfully!!!", customer });
      })
      .catch((err) => asyncError(err, next));
  } else {
    throw new Error("Please send a correct customerId!!!");
  }
};

exports.saveCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Some input fields validation error arises!",
      errors: errors.array(),
    });
  }
  const { customerId } = req.params;
  const customer = new Customer({ ...req.body });
  let ops = customerId
    ? Customer.find({ _id: mongoose.Types.ObjectId(customerId) })
        .then((cstmr) => {
          if (!cstmr) {
            return res
              .status(404)
              .json({ message: "Customer record is not present!!!" });
          }
          return customer.save();
        })
        .catch((err) => console.log(err))
    : customer.save();
  return ops
    .then((cstmr) => {
      if (!cstmr) {
        return res
          .status(500)
          .json("Something went wrong, please try again!!!");
      }
      return res.status(201).json({
        message: `Customer ${
          customerId ? "updated" : "created"
        } successfully!!!`,
        customer: cstmr,
      });
    })
    .catch((err) => asyncError(err, next));
};

exports.deleteCustomer = (req, res, next) => {
  const { customerId } = req.params;
  if (customerId) {
    return Customer.findOne({
      _id: mongoose.Types.ObjectId(customerId),
    })
      .then((cstmr) => {
        if (!cstmr) {
          return res
            .status(404)
            .json({ message: "Customer record is not present!!!" });
        }
        return Customer.deleteOne({_id: mongoose.Types.ObjectId(customerId)}).then((rslt) => {
          return res.status(200).json({
            message: "Customer data deleted successfully!!!",
          })
        })
      })
      .catch((err) => asyncError(err, next));
  } else {
    throw new Error("Please send a correct customerId!!!");
  }
};
