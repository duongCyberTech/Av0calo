const pool = require('../config/db');

class CartService {
    async getCart(uid) {
        const query = `
            SELECT 
                cart.pid, 
                cart.quantity, 
                p.title, 
                p.sell_price, 
                p.stock,
                (SELECT img_url FROM img WHERE pid = p.pid LIMIT 1) as image
            FROM cart
            JOIN products p ON cart.pid = p.pid
            WHERE cart.uid = ?
        `;
        const [rows] = await pool.query(query, [uid]);
        return rows;
    }

    async addToCart(uid, pid, quantity) {
        const [existing] = await pool.query(
            `SELECT quantity FROM cart WHERE uid = ? AND pid = ?`, 
            [uid, pid]
        );

        if (existing.length > 0) {
            await pool.query(
                `UPDATE cart SET quantity = quantity + ? WHERE uid = ? AND pid = ?`,
                [quantity, uid, pid]
            );
        } else {
            await pool.query(
                `INSERT INTO cart (uid, pid, quantity) VALUES (?, ?, ?)`,
                [uid, pid, quantity]
            );
        }
        return true;
    }

    async updateQuantity(uid, pid, quantity) {
        if (quantity <= 0) {
            return this.removeFromCart(uid, pid);
        }
        await pool.query(
            `UPDATE cart SET quantity = ? WHERE uid = ? AND pid = ?`,
            [quantity, uid, pid]
        );
        return true;
    }

    async removeFromCart(uid, pid) {
        await pool.query(
            `DELETE FROM cart WHERE uid = ? AND pid = ?`, 
            [uid, pid]
        );
        return true;
    }

    async clearCart(uid) {
        await pool.query(`DELETE FROM cart WHERE uid = ?`, [uid]);
        return true;
    }
}

module.exports = new CartService();