const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

const { authen } = require('../middlewares/authentication.middleware');
const { authorize } = require('../middlewares/authorization.middleware');

router.post('/create', authen, authorize(['admin']), ProductController.create);

//router.get("/", ProductController.getAll);
//router.get("/:id", ProductController.getOne);
//router.put("/:id", authen, authorize(["admin"]), ProductController.update);
//router.delete("/:id", authen, authorize(["admin"]), ProductController.delete);

module.exports = router;
