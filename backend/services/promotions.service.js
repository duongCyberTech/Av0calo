const pool = require('../config/db');
const {generateToken} = require('../utils/jwt');
const { uuidv7: uuid } = require('uuidv7');

class PromotionsService {
    async createPromotion(promotionData) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();
        try {
            const { title, stock, discount_type, discount_num, max_discount, discount_for, product_lst } = promotionData;
            if (!title || !stock || !discount_type || !discount_num) {
                return { status: 400, message: "Missing required fields" };
            }

            if (discount_type === 'percent' && (!max_discount || max_discount <= 0)) {
                return { status: 400, message: "Invalid max discount for percentage type" };
            }

            const promo_id = uuid();

            const [result] = await transaction.query(`
                INSERT INTO promotions (
                    promo_id, title, stock, used, discount_type, 
                    discount_num, max_discount, discount_for
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [promo_id, title, stock, 0, discount_type, discount_num, max_discount || discount_num, discount_for || 'all']);
            if (result.affectedRows === 0) {
                return { status: 400, message: "Failed to insert promotion" };
            }

            if (discount_for == 'product' && product_lst && Array.isArray(product_lst) && product_lst.length > 0) {
                for (const product_id of product_lst) {
                    await transaction.query(`
                        INSERT INTO promotion_products (promo_id, product_id)
                        VALUES (?, ?)
                    `, [promo_id, product_id]);
                }
            }

            await transaction.commit();
            return { status: 201, message: "Promotion created successfully", data: { ...promotionData, promo_id } };
        } catch (error) {
            await transaction.rollback();
            return { status: 500, message: "Failed to create promotion" };
        } finally {
            transaction.release();
        }
    }

    async discountValue(transaction, promo_id, order_id) {
        try {
            const [promoRows] = await transaction.query(`
                SELECT * FROM promotions WHERE promo_id = ?
            `, [promo_id]);

            if (promoRows.length === 0) {
                throw new Error("Promotion not found");
            }
            const promo = promoRows[0];

            switch (promo.discount_for) {
                case 'all': {
                    const [products] = await transaction.query(`
                        SELECT p.sell_price, oi.quantity
                        FROM orders_item as oi
                        JOIN products as p ON oi.pid = p.pid
                        WHERE oi.oid = ?
                    `, [order_id]);
                    
                    const totalAmount = products.reduce((sum, item) => sum + Number(item.sell_price) * Number(item.quantity), 0);
                
                    const discount = promo.discount_type === 'percent'
                        ? Math.min(totalAmount * (Number(promo.discount_num) / 100), Number(promo.max_discount))
                        : Number(promo.discount_num);              
                    
                    return {discount, totalAmount};
                }

                case 'product': {
                    const [products] = await transaction.query(`
                        SELECT p.sell_price, oi.quantity
                        FROM orders as o
                        JOIN orders_item oi ON o.oid = oi.oid
                        JOIN promo_apply_product pap ON oi.pid = pap.pid
                        JOIN products p ON oi.pid = p.pid
                        WHERE o.oid = ? AND pap.promo_id = ?
                    `, [order_id, promo_id]);
                    const totalAmount = products.reduce((sum, item) => sum + Number(item.sell_price) * Number(item.quantity), 0);
                
                    const discount = promo.discount_type === 'percent'
                        ? Math.min(totalAmount * (Number(promo.discount_num) / 100), Number(promo.max_discount))
                        : Number(promo.discount_num);    
                    
                    return {discount, totalAmount};
                }
                default:
                    return 0;
            }
        } catch (error) {
            return 0;
        } 
    }

    async getAllPromotions(queryParams) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();
        try {
            const { search, page, limit, order_id } = queryParams;
            const offset = page && limit ? (Number(page) - 1) * Number(limit) : 0;
            const today = new Date().toISOString();
            console.log("today: ", today);
            let params = [];
            
            if (order_id) {
                params.push(order_id);
                params.push(today, today);
                let query = `
                    SELECT pr.* 
                    FROM orders as o
                    JOIN orders_item as oi ON o.oid = oi.oid
                    JOIN products as p ON oi.pid = p.pid
                    JOIN promo_apply_product as pap ON p.pid = pap.pid
                    JOIN promotions as pr ON pap.promo_id = pr.promo_id
                    WHERE (o.oid = ? AND pr.start_date <= ? AND pr.expire_date >= ? AND pr.stock > 0`;
                if (search) {
                    query += ` AND pr.title LIKE ?`;
                    params.push(`%${search}%`);
                }

                query += `) OR (pr.discount_for = 'all' AND pr.start_date <= ? AND pr.expire_date >= ? AND pr.stock > 0)`;
                params.push(today, today);

                query += ` GROUP BY pr.promo_id `;

                if (limit) {
                    query += ` LIMIT ? OFFSET ?`;
                    params.push(Number(limit), Number(offset));
                }

                const [promos1] = await transaction.query(query, params);

                params = []
                params.push(today, today);
                query = `
                    SELECT * 
                    FROM promotions 
                    WHERE start_date <= ? AND expire_date >= ? pr.stock > 0`;
                
                if (search) {
                    query += ` AND title LIKE ?`;
                    params.push(`%${search}%`);
                }
                if (limit) {
                    query += ` LIMIT ? OFFSET ?`;
                    params.push(Number(limit), Number(offset));
                }

                const [promos2] = await transaction.query(query, params);

                const promos = [...promos1, ...promos2];
                let result = [];

                if (promos && promos.length > 0) {
                    // Bước 1: Tính toán song song tất cả discount
                    const computedPromos = await Promise.all(promos.map(async (item) => {
                        const {discount, totalAmount} = await this.discountValue(transaction, item.promo_id, order_id);
                        return { ...item, discount: discount || 0, totalAmount: totalAmount || 0 };
                    }));

                    // Bước 2: Lọc và Sắp xếp trên kết quả đã có
                    result = computedPromos
                        .filter(item => item.discount > 0)
                        .sort((a, b) => b.discount - a.discount); // Sắp xếp giảm dần (Giảm nhiều lên đầu)
                }

                return { status: 200, data: result };
            }

            params.push(today, today);
            let query = `
                SELECT * 
                FROM promotions 
                WHERE start_date <= ? AND expire_date >= ?`;
            
            if (search) {
                query += ` AND title LIKE ?`;
                params.push(`%${search}%`);
            }
            if (limit) {
                query += ` LIMIT ? OFFSET ?`;
                params.push(Number(limit), Number(offset));
            }

            const [promos] = await transaction.query(query, params);

            const result = promos ? promos.sort((a, b) => new Date(b.expire_date) - new Date(a.expire_date)) : [];
            return { status: 200, data: result };
        } catch (error) {
            await transaction.rollback();
            return { status: 500, message: error.message };
        } finally {
            transaction.release();
        }
    }
}

module.exports = new PromotionsService();