const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const { authen } = require('../middlewares/authentication.middleware'); 

router.get('/', authen, CartController.getCart);          
router.post('/', authen, CartController.addToCart);        
router.put('/', authen, CartController.updateCart);        
router.delete('/', authen, CartController.clearCart);      // Phải đặt trước route /:pid
router.delete('/:pid', authen, CartController.removeItem);     

module.exports = router;