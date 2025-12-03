const pool = require('../config/db');
const { uuidv7: uuid } = require('uuidv7');
const { checkExist } = require('../utils/utils');

class ProductService {
  //Create
  async CreatProduct(data, uid) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const {
        title,
        description,
        stock,
        sold,
        cost,
        sell_price,
        rating,
        size,
        unit,
        cate_id,
        images,
      } = data;
      // Validate cơ bản
      if (!title || !sell_price || !cate_id) {
        throw new Error(
          'Thiếu thông tin bắt buộc: Tên, Giá bán hoặc Danh mục!'
        );
      }
      const pid = uuid();
      const queryProduct = `INSERT INTO products(pid, title, description, stock, sold, cost, sell_price, rating, size, unit, cate_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await connection.query(queryProduct, [
        pid,
        title,
        description,
        stock,
        sold || 0,
        cost,
        sell_price,
        rating || 0,
        size,
        unit,
        cate_id,
      ]);
      // insert ảnh vào
      if (images && images.length > 0) {
        const imageValues = images.map((url, index) => [pid, index + 1, url]);

        await connection.query(`INSERT INTO img (pid, iid, img_url) VALUES ?`, [
          imageValues,
        ]);
      }
      //ghi log
      if (uid) {
        await connection.query(
          `INSERT INTO product_management (admin_id, pid, modify_at) VALUES (?, ?, NOW())`,
          [uid, pid]
        );
      }

      await connection.commit(); // Lưu tất cả
      return { pid, message: 'Thêm sản phẩm thành công!' };
    } catch (error) {
      await connection.rollback(); // Có lỗi thì hủy hết
      throw new Error(error.message);
    } finally {
      connection.release();
    }
  }
}

module.exports = new ProductService();
