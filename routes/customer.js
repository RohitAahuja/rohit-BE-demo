const express = require("express");

const { customerValidator, emailAlreadyPresentValidator } = require("../utility/validator");
const customerController = require("../controllers/customer");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("", isAuth, customerController.getCustomers);

router.post("", isAuth, customerValidator(), emailAlreadyPresentValidator(), customerController.createCustomer);

router.get("/:customerId", isAuth, customerController.getCustomers);

router.put("/:customerId", isAuth, customerValidator(), customerController.updateCustomer);

router.delete("/:customerId", isAuth, customerController.deleteCustomer);

module.exports = router;
