const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orders.controller');
const { authen } = require('../middlewares/authentication.middleware');

router.post('/', authen, OrderController.createOrder);        
router.get('/', authen, OrderController.getMyOrders);        
router.get('/:oid', authen, OrderController.getOrderDetails);
router.put('/:oid/cancel', authen, OrderController.cancelOrder);

module.exports = router;