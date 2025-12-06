const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller')
const { authen } = require('../middlewares/authentication.middleware');
const { authorize } = require('../middlewares/authorization.middleware');

router.post('/:oid', authen, PaymentController.createUrl);
router.get('/vnpay_return', PaymentController.vnpayReturn);

module.exports = router;