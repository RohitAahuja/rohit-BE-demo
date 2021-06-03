const express = require("express");
const { body } = require("express-validator");
const { customerValidator, emailAlreadyPresentValidator } = require("../utility/validator");
const customerController = require("../controllers/customer");

const router = express.Router();

router.get("", customerController.getCustomers);

router.post("", customerValidator(), emailAlreadyPresentValidator(), customerController.saveCustomer);

router.get("/:customerId", customerController.getCustomers);

router.put("/:customerId", customerValidator(), customerController.saveCustomer);

router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
