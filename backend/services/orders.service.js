const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const PromotionsService = require('./promotions.service');
class OrderService {
  async createOrder(uid, data) {
    console.log(uid)
    const {
      aid,
      ship_id,
      pay_type, // cash or online
      note,
      promo_id,
    } = data;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const shippingFee = 0;
      let isPaidValue = 0;
      if (pay_type === "online") {
          isPaidValue = 1;
      }
      if (ship_id) {
        const [checkShip] = await connection.query(
          `SELECT ship_id FROM shipment WHERE ship_id = ?`,
          [ship_id]
        );
        if (checkShip.length === 0)
          throw new Error("Mã vận chuyển không hợp lệ");
      }
      if (!aid) throw new Error("Vui lòng chọn địa chỉ giao hàng");
      const [checkAddr] = await connection.query(
        `SELECT aid FROM addresses WHERE aid = ? AND uid = ?`,
        [aid, uid]
      );
      console.log(checkAddr)
      if (checkAddr.length === 0) throw new Error("Địa chỉ không hợp lệ");

      const [cartItems] = await connection.query(
        `SELECT c.pid, c.quantity, p.sell_price, p.stock, p.title
         FROM cart c JOIN products p ON c.pid = p.pid WHERE c.uid = ?`,
        [uid]
      );
      if (cartItems.length === 0) throw new Error("Giỏ hàng trống!");
      let totalPrice = 0;
      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          throw new Error(`Sản phẩm "${item.title}" không đủ hàng`);
        }
        totalPrice += Number(item.sell_price) * item.quantity;
      }
      let finalPrice = totalPrice + shippingFee;
      const oid = uuidv4();
      const orderTitle = `ORD-${Date.now().toString().slice(-6)}`;
      await connection.execute(
        `
        INSERT INTO orders 
        (
          oid, title, description, 
          create_at, update_at, status, 
          is_paid, pay_type, 
          total_price, final_price, shipping_fee, 
          ship_id, customer_id, aid
        )
        VALUES (?, ?, ?, NOW(), NOW(), 'pending', ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          oid,
          orderTitle,
          note,
          isPaidValue,
          pay_type,
          totalPrice,
          finalPrice,
          shippingFee,
          ship_id,
          uid,
          aid,
        ]
      );
      for (const item of cartItems) {
        await connection.execute(
          `INSERT INTO orders_item (oid, pid, quantity) VALUES (?, ?, ?)`,
          [oid, item.pid, item.quantity]
        );
        await connection.execute(
          `UPDATE products SET stock = stock - ?, sold = sold + ? WHERE pid = ?`,
          [item.quantity, item.quantity, item.pid]
        );
      }
      let discountAmount = 0;
      if (promo_id) {
          const {discount} = await PromotionsService.discountValue(connection, promo_id, oid);
          discountAmount = discount;
          if (discountAmount > 0) {
              finalPrice = Math.max(0, finalPrice - discountAmount); 
              await connection.execute(
                  `UPDATE orders SET final_price = ? WHERE oid = ?`, 
                  [finalPrice, oid]
              );
              await connection.execute(
                  `UPDATE promotions SET used = used + 1 WHERE promo_id = ?`,
                  [promo_id]
              );
          }
      }
      await connection.execute(`DELETE FROM cart WHERE uid = ?`, [uid]);

      await connection.commit();
      return {
        oid,
        title: orderTitle,
        final_price: finalPrice,
        discount: discountAmount,
        message: "Đặt hàng thành công",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async getMyOrders(uid) {
    const [orders] = await pool.query(
      `
      SELECT 
        o.oid, o.title, o.status, o.final_price, o.create_at, 
        s.delivery, u.fname, u.lname,
        a.city, a.district, a.street
      FROM orders o
      LEFT JOIN shipment s ON o.ship_id = s.ship_id
      LEFT JOIN users u ON o.customer_id = u.uid
      LEFT JOIN addresses a ON o.aid = a.aid
      WHERE o.customer_id = ?
      ORDER BY o.create_at DESC
      `,
      [uid]
    );
    return orders;
  }

  async getOrderDetails(uid, oid) {
    const [order] = await pool.query(
      `
      SELECT 
        o.*, 
        s.delivery,
        a.street, a.district, a.city, 
        u.fname, u.lname, u.phone   
      FROM orders o
      LEFT JOIN shipment s ON o.ship_id = s.ship_id
      LEFT JOIN addresses a ON o.aid = a.aid
      LEFT JOIN users u ON o.customer_id = u.uid
      WHERE o.oid = ? AND o.customer_id = ?
      `,
      [oid, uid]
    );

    if (order.length === 0) return null;

    const [items] = await pool.query(
      `
      SELECT oi.quantity, p.title, 
             (SELECT img_url FROM img WHERE pid = p.pid LIMIT 1) as image
      FROM orders_item oi
      JOIN products p ON oi.pid = p.pid
      WHERE oi.oid = ?
      `,
      [oid]
    );

    return { ...order[0], items };
  }

  async cancelOrder(uid, oid) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [order] = await connection.query(
        `SELECT status FROM orders WHERE oid = ? AND customer_id = ?`,
        [oid, uid]
      );

      if (order.length === 0) throw new Error("Đơn hàng không tồn tại");
      if (order[0].status !== "pending")
        throw new Error("Chỉ có thể hủy đơn hàng đang chờ (Pending)");

      await connection.execute(
        `UPDATE orders SET status = 'cancel', update_at = NOW() WHERE oid = ?`,
        [oid]
      );

      const [items] = await connection.query(
        `SELECT pid, quantity FROM orders_item WHERE oid = ?`,
        [oid]
      );
      for (const item of items) {
        await connection.execute(
          `UPDATE products SET stock = stock + ?, sold = sold - ? WHERE pid = ?`,
          [item.quantity, item.quantity, item.pid]
        );
      }
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderService();
