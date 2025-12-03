const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

const { authen } = require('../middlewares/authentication.middleware');
const { authorize } = require('../middlewares/authorization.middleware');

router.post('/create', authen, authorize(['admin']), ProductController.create);

router.get('/all', ProductController.getAllProducts);
router.get('/:pid', ProductController.getDetailProduct);
router.put(
  '/:pid',
  authen,
  authorize(['admin']),
  ProductController.updateProduct
);
router.delete(
  '/:pid',
  authen,
  authorize(['admin']),
  ProductController.deleteProduct
);

module.exports = router;
