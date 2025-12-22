const PaymentService = require('../services/payment.service');
const pool = require('../config/db');
const qs = require('qs');
class PaymentController {
  async createUrl(req, res) {
    try {
      const bankCode = req.body.bankCode || null;
      const language = req.body.language || 'vn';
      const oid = req.params.oid;
      const url = await PaymentService.createPayment(oid, bankCode, language);
      return res.status(200).json({
        success: true,
        paymentUrl: url,
      });
    } catch (error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
      }
      if (error.message === 'ORDER_ALREADY_PAID') {
        return res
          .status(400)
          .json({ message: 'Đơn hàng này đã thanh toán rồi!' });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async vnpayReturn(req, res) {
    try {
      const vnp_Params = req.query;
      const result = await PaymentService.verifyReturn(vnp_Params);
      const connection = await pool.getConnection();
      const oid = result.oid;

      if (!oid) {
        return res.status(400).json({ message: 'Không tìm thấy mã đơn hàng' });
      }

      try {
        if (result.isSuccess) {
          // Kiểm tra xem đơn hàng đã thanh toán chưa để tránh cập nhật nhiều lần
          const [orderCheck] = await connection.query(
            `SELECT is_paid FROM orders WHERE oid = ?`,
            [oid]
          );
          
          if (orderCheck.length === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
          }
          
          // Chỉ cập nhật nếu chưa thanh toán
          if (orderCheck[0].is_paid === 0) {
            await connection.query(
              `UPDATE orders SET is_paid = 1, pay_type = 'online' WHERE oid = ?`,
              [oid]
            );
          }
          // return res.redirect(`http://localhost:5000/payment/success?oid=${oid}`);
          return res.send(`
        <h1 style="color: green; text-align: center; margin-top: 50px;">
            ✅ THANH TOÁN THÀNH CÔNG!
        </h1>
        <p style="text-align: center;">Mã đơn hàng: <b>${oid}</b></p>
        <p style="text-align: center;">Database đã được cập nhật.</p>
    `);
        } else {
          await connection.query(
            `UPDATE orders SET is_paid = 0 WHERE oid = ?`,
            [oid]
          );
          // return res.redirect(`http://localhost:5000/payment/failed?oid=${oid}`);
          return res.send(`
        <h1 style="color: red; text-align: center; margin-top: 50px;">
            ❌ THANH TOÁN THẤT BẠI
        </h1>
    `);
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new PaymentController();
