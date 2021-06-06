const express = require('express');

const authController = require('../controllers/auth');

const { loginValidator, signUpValidator } = require('../utility/validator');

const router = express.Router();

router.post('/login', loginValidator(), authController.login);

router.post('/signup', signUpValidator(), authController.signUp);

module.exports = router;