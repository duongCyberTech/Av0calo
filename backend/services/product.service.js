const pool = require('../config/db');
const { uuidv7: uuid } = require('uuidv7');
const {cloudinary} = require('../config/cloudinary')
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
      //deleted default 0 nên không cần thêm
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
        const imageValues = images.map((url) => [pid, uuid(), url]);

        await connection.query(`INSERT INTO img (pid, iid, img_url) VALUES ?`, [
          imageValues,
        ]);
      }
      //ghi log
      if (uid) {
        await connection.query(
          `INSERT INTO product_management (admin_id, pid, modify_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 HOUR))`,
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
  //Read
  async getAllProducts() {
    try {
      const query = `
        SELECT 
          p.*, 
          c.cate_name,
          (SELECT img_url FROM img WHERE pid = p.pid LIMIT 1) as thumbnail
        FROM products p
        LEFT JOIN categories c ON p.cate_id = c.cate_id
        WHERE p.deleted <> 1
        ORDER BY p.pid DESC
      `;
      const [products] = await pool.query(query);
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getDetailProduct(pid) {
    try {
      const [rows] = await pool.query(
        `SELECT p.*, c.cate_name 
         FROM products p
         LEFT JOIN categories c ON p.cate_id = c.cate_id
         WHERE p.pid = ? AND p.deleted <> 1`,
        [pid]
      );

      if (rows.length === 0) return null;

      const product = rows[0];
      const [imageRows] = await pool.query(
        `SELECT img_url FROM img WHERE pid = ?`,
        [pid]
      );

      product.images = imageRows.map((item) => item.img_url);

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //update
  getPublicIdFromUrl(url) {
    try {
      const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
      const match = url.match(regex);
      return match ? match[1] : null; 
    } catch (error) {
      console.error("Lỗi tách public_id:", error);
      return null;
    }
  }
  async updateProduct(pid, uid, data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [check] = await connection.query(
        `SELECT pid FROM products WHERE pid = ?`,
        [pid]
      );
      if (check.length === 0) {
        throw new Error('Sản phẩm không tồn tại!');
      }

      const {
        title,
        description,
        stock,
        cost,
        sell_price,
        rating,
        size,
        unit,
        cate_id,
        images,
        deleted,
      } = data;

      const updateQuery = `
        UPDATE products 
        SET 
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          stock = COALESCE(?, stock),
          cost = COALESCE(?, cost),
          sell_price = COALESCE(?, sell_price),
          rating = COALESCE(?, rating),
          size = COALESCE(?, size),
          unit = COALESCE(?, unit),
          cate_id = COALESCE(?, cate_id),
          deleted = COALESCE(?, deleted)
        WHERE pid = ?
      `;

      await connection.query(updateQuery, [
        title,
        description,
        stock,
        cost,
        sell_price,
        rating,
        size,
        unit,
        cate_id,
        deleted,
        pid,
      ]);

      if (images && Array.isArray(images) && images.length > 0) {
        const [oldImages] = await connection.query(`SELECT img_url FROM img WHERE pid = ?`, [pid]);

        if (oldImages.length > 0) {
          for (const img of oldImages) {
            const publicId = this.getPublicIdFromUrl(img.img_url);
            if (publicId) {
              // Gọi lệnh xóa của Cloudinary
              cloudinary.uploader.destroy(publicId);
            }
          }
        }
        await connection.query(`DELETE FROM img WHERE pid = ?`, [pid]);

        // Thêm ảnh vào DB
        const imageValues = images.map((url) => [pid, uuid(), url]);
        await connection.query(`INSERT INTO img (pid, iid, img_url) VALUES ?`, [imageValues]);
      }

      //ghi log
      if (uid) {
        await connection.query(
          `UPDATE product_management SET modify_at = DATE_ADD(NOW(), INTERVAL 7 HOUR)
          WHERE pid = ? AND admin_id = ?`,
          [pid, uid]
        );
      }

      await connection.commit();
      return { message: 'Cập nhật sản phẩm thành công!' };
    } catch (error) {
      await connection.rollback();
      throw new Error(error.message);
    } finally {
      connection.release();
    }
  }

  async deleteProduct(pid, uid) {
    return this.updateProduct(pid, uid, { deleted: '1' });
  }
}

module.exports = new ProductService();
