const AuthController = require('../controllers/auth.controller')
const express = require('express');
const router = express.Router();
const { validateRegister } = require('../middlewares/validation.middleware')

router.post('/register', validateRegister, AuthController.register)
router.post('/login', AuthController.login)
router.post('/send-otp', AuthController.sendOTP)
router.post('/verify-otp', AuthController.verifyOTP)

module.exports=router