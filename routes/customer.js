const express = require('express');

const customerController = require('../controllers/customer');

const router = express.Router();

router.get('/customers', customerController.getCustomer);

module.exports = router;