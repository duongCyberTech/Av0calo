const productService = require('../services/product.service');
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

  async getAllProducts(req, res) {
    try {
      const result = await ProductService.getAllProducts();
      return res.status(201).json({ result });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async getDetailProduct(req, res) {
    try {
      const result = await ProductService.getDetailProduct(req.params.pid);
      if (!result) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const result = await ProductService.updateProduct(
        req.params.pid,
        req.user.uid,
        req.body
      );
      if (!result) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
  async deleteProduct(req, res) {
    try {
      const result = await ProductService.deleteProduct(
        req.params.pid,
        req.user.uid
      );
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}

module.exports = new ProductController();
