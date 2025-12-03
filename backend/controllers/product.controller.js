const ProductService = require('../services/product.service');

class ProductController {
  async create(req, res) {
    try {
      const uid = req.user.uid;
      // Gọi Service
      const result = await ProductService.CreatProduct(req.body, uid);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.pid,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
