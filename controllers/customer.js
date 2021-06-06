const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Customer = require("../models/customer");
const User = require("../models/user");
const { asyncError, syncError } = require("../utility/errors");
const { DEFAULTPAGENUMBER, MAXITEMSPERPAGE } = require("../constants/constant");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.getCustomers = (req, res, next) => {
  const { currentPage } = req.query.page || DEFAULTPAGENUMBER;
  let totalItems;
  Customer.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Customer.find()
        .skip((currentPage - 1) * MAXITEMSPERPAGE)
        .limit(MAXITEMSPERPAGE);
    })
    .then((customers) => {
      if (!customers) {
        customers = [];
      }
      return res.status(200).json({
        message: "Customers List Fetched successfully!!!",
        customers,
        totalItems,
        currentPage,
        itemsPerPage: MAXITEMSPERPAGE,
      });
    })
    .catch((err) => asyncError(err, next));
};

exports.getCustomerById = (req, res, next) => {
  const { customerId } = req.params;
  if (customerId) {
    let loadedCustomer;
    return Customer.findById(customerId)
      .then((customer) => {
        if (!customer) {
          return res.status(404).json({
            message: "Details of selected customer id is not present!!!",
          });
        }
        loadedCustomer = customer;
        return User.findById(req.userId)
          .populate({
            path: "customers",
            match: { _id: mongoose.Types.ObjectId(customerId) },
          })
          .exec();
      })
      .then((usr) => {
        if (!usr) {
          asyncError(
            "You are not allow to edit this customer record!!!",
            next,
            401
          );
        }
        return res.status(200).json({
          message: "Customer Fetched successfully!!!",
          loadedCustomer,
        });
      })
      .catch((err) => asyncError(err, next));
  } else {
    throw new Error("Please send a correct customerId!!!");
  }
};

exports.createCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    syncError(errors.errors[0].msg, 422);
  }
  const photo = req.body.photo;
  if (req.file) {
    photo = req.file.path;
  }
  if (!photo) {
    syncError("No Photo Attached!!!", 422);
  }
  const customer = new Customer({ ...req.body, photo, create });
  customer
    .save()
    .then(() => User.findById(req.userId))
    .then((usr) => usr.customers.push(customer))
    .then(() => {
      return res
        .status(201)
        .json({ message: "Customer crated Successfully!!!", customer });
    })
    .catch((err) => asyncError(err, next));
};

exports.updateCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    syncError(errors.errors[0].msg, 422);
  }

  const photo = req.body.photo;
  if (req.file) {
    photo = req.file.path;
  }
  if (!photo) {
    syncError("No Photo Attached!!!", 422);
  }
  const { customerId } = req.params;
  if (!customerId) {
    syncError("Please provide a valid customerId!!!!", 400);
  }

  Customer.findById(customerId)
    .then((customer) => {
      if (!customer) {
        asyncError("Selected customer record is not present!!!", next, 404);
      }
      if (customer.creator.toString() !== req.userId) {
        asyncError("Not Authenticate User!!!", next, 403);
      }
      if (customer.photo !== photo) {
        clearImage(photo);
      }
      customer = { ...customer, ...req.body };
      return customer.save();
    })
    .then((rslt) => {
      if (!rslt) {
        asyncError("Something went wrong, please try again!!!", next, 500);
      }
      return res.status(201).json({
        message: `Customer updated successfully!!!`,
        customer,
      });
    })
    .catch((err) => asyncError(err, next));
};

exports.deleteCustomer = (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId) {
    syncError("Please provide a valid customerId!!!!", 400);
  }

  Customer.findById(customerId)
    .then((customer) => {
      if (!customer) {
        asyncError("Selected customer record not present!!!", next, 404);
      }
      if (customer.creator.toString() !== req.userId) {
        asyncError("Not Authenticated User!!!", next, 403);
      }
      clearImage(customer.photo);
      return Customer.findByIdAndRemove(customerId);
    })
    .then(() => User.findById(req.userId))
    .then((user) => {
      user.customers.pull(customerId);
      return user.save();
    })
    .then((rslt) => {
      return res
        .json(200)
        .json({ message: "Customer deleted successfully!!!" });
    })
    .catch((err) => asyncError(err, next, 500));
};
