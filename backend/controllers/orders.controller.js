const OrderService = require("../services/orders.service");

class OrderController {
  async createOrder(req, res) {
    try {
      const uid = req.user.uid;
      const { aid, ship_id, pay_type, note } = req.body;

      if (!aid)
        return res.status(400).json({ message: "Thiếu ID địa chỉ (aid)" });
      if (!pay_type)
        return res
          .status(400)
          .json({ message: "Thiếu phương thức thanh toán" });

      const result = await OrderService.createOrder(uid, {
        aid,
        ship_id,
        pay_type,
        note,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const result = await OrderService.getMyOrders(req.user.uid);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const result = await OrderService.getOrderDetails(
        req.user.uid,
        req.params.oid
      );
      if (!result) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      await OrderService.cancelOrder(req.user.uid, req.params.oid);
      return res.status(200).json({ message: "Đã hủy đơn hàng" });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new OrderController();
