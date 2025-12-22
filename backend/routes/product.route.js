const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { uploadCloud } = require('../config/cloudinary');
const { authen } = require('../middlewares/authentication.middleware');
const { authorize } = require('../middlewares/authorization.middleware');

router.post(
  '/create',
  authen,
  authorize(['admin']),
  uploadCloud.array('images', 10),
  ProductController.create
);

router.get('/all', ProductController.getAllProducts);
router.get('/:pid', ProductController.getDetailProduct);
router.put(
  '/:pid',
  authen,
  authorize(['admin']),
  uploadCloud.array('images', 10),
  ProductController.updateProduct
);
router.delete(
  '/:pid',
  authen,
  authorize(['admin']),
  ProductController.deleteProduct
);

module.exports = router;
