const AuthController = require('../controllers/auth.controller')
const express = require('express');
const router = express.Router();
const { validateRegister } = require('../middlewares/validation.middleware')

router.post('/register', validateRegister, AuthController.register)
router.post('/login', AuthController.login)

module.exports=router