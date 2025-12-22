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

    async comfirmUsePromotion(transaction, uid, promo_id){
        try {
            const checkUsePublic = await transaction.query(`
                UPDATE promotions
                SET stock = stock - 1
                WHERE stock > 0 AND promo_id = ?
            `,[promo_id])

            if (checkUsePublic.affectedRows > 0) {
                await transaction.query(`
                    UPDATE promotions
                    SET used = used + 1
                    WHERE promo_id = ?
                `,[promo_id])
                return;
            }

            const checkUsePrivate = await transaction.query(`
                UPDATE customer_promo
                SET quantity = quantity - 1
                WHERE uid = ? AND promo_id = ?
            `, [uid, promo_id])

            if (checkUsePrivate.affectedRows > 0) {
                await transaction.query(`
                    UPDATE promotions
                    SET used = used + 1
                    WHERE promo_id = ?
                `,[promo_id])
                return;
            }
        } catch (error) {
            return;
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
        const connection = await pool.getConnection();
        try {
            const { search, page, limit, order_id } = queryParams;
            const offset = page && limit ? (Number(page) - 1) * Number(limit) : 0;
            let params = [];
            
            // Explicitly select only columns that exist in the table
            // Avoid SELECT * to prevent any view/stored procedure issues
            let query = `SELECT promo_id, title, stock, used, discount_type, discount_num, max_discount, discount_for FROM promotions WHERE stock > 0`;
            
            if (search) {
                query += ` AND title LIKE ?`;
                params.push(`%${search}%`);
            }
            
            if (limit) {
                query += ` LIMIT ? OFFSET ?`;
                params.push(Number(limit), Number(offset));
            }

            console.log('Executing query:', query);
            console.log('With params:', params);
            
            const [promos] = await connection.query(query, params);

            let result = promos || [];
            
            // If order_id is provided, calculate discount for each promotion
            if (order_id && result.length > 0) {
                const computedPromos = await Promise.all(result.map(async (item) => {
                    try {
                        const {discount, totalAmount} = await this.discountValue(connection, item.promo_id, order_id);
                        return { ...item, discount: discount || 0, totalAmount: totalAmount || 0 };
                    } catch (error) {
                        console.error('Error calculating discount for promo:', item.promo_id, error);
                        return { ...item, discount: 0, totalAmount: 0 };
                    }
                }));

                // Filter and sort by discount amount
                result = computedPromos
                    .filter(item => item.discount > 0)
                    .sort((a, b) => b.discount - a.discount);
            } else {
                // Sort by stock (most available first) or by title
                result = result.sort((a, b) => {
                    if (b.stock !== a.stock) {
                        return b.stock - a.stock;
                    }
                    return a.title.localeCompare(b.title);
                });
            }

            return { status: 200, data: result };
        } catch (error) {
            console.error('Error in getAllPromotions:', error);
            console.error('Error stack:', error.stack);
            return { status: 500, message: error.message };
        } finally {
            connection.release();
        }
    }
}

module.exports = new PromotionsService();