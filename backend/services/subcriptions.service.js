const pool = require('../config/db')
const { uuidv7: uuid } = require('uuidv7')
const { checkExist } = require('../utils/utils')
const PaymentService = require('../services/payment.service')

class SubcriptionService {
    async createSubcription(data) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();
        try {
            const { title, description, duration, price, promo_lst, product_lst } = data
            if (!title || !price || !product_lst) throw new Error("Missing fields!")
            
            const isExisted = await checkExist('subcriptions', 'title', title)
            if (isExisted) throw new Error("The subcription has already been created!")
            
            const id = uuid()
            const [newSub] = await transaction.query(`
                INSERT INTO subcriptions
                VALUE (?, ?, ?, ?, ?)
            `, [id, title, description || "", duration || "weekly", price])

            for (const promo of promo_lst || []) {
                const { promo_id, quantity } = promo
                await transaction.query(`
                    INSERT INTO given_promo (sub_id, promo_id, quantity)
                    VALUE (?, ?, ?)
                `, [id, promo_id, quantity || 1])
            }

            for (const product of product_lst) {
                const { product_id, quantity } = product
                await transaction.query(`
                    INSERT INTO subcribe_pack(sub_id, pid, quantity)
                    VALUE (?, ?, ?)
                    `, 
                [id, product_id, quantity || 1])
            }

            await transaction.commit()
            return newSub.affectedRows ? { ...data, sub_id: id } : null
        } catch (error) {
            await transaction.rollback()
            throw new Error(error.message)
        } finally {
            transaction.release()
        }
    }

    async getAllSubcriptions(duration) {
        try {
            const [subs] = await pool.query(`
                SELECT * FROM subcriptions
                ${duration ? 'WHERE duration = ?' : ''}
            `, duration ? [duration] : []
            )
            return subs
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async payForSubcription(uid, sub_id, bankCode = "NCB") {
        try {
            const [subs] = await pool.query(`
                SELECT price FROM subcriptions
                WHERE sub_id = ?
            `,[sub_id]) 

            if (subs.length <= 0) return {status: 400, message: "Subcription Pack not exist!"}
            
            const price = subs[0].price

            console.log(price)
            
            const trans = await PaymentService.createTransaction(`${uid}_${sub_id}_signsubcription`, price, bankCode)
            return {status: 200, url: trans}
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async registerSubcription(uid, sub_id) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();
        try {
            const today = new Date().toISOString()
            const isSubcribed = await transaction.query(`
                SELECT customer_id from subcribe
                WHERE customer_id = ? AND sub_id LIKE ? AND expire_at < ?`,
            [uid, sub_id, today])

            if (isSubcribed[0].length > 0) throw new Error("You have already subcribed this package!")

            const expire_at = new Date(today)

            const [sub] = await transaction.query(`
                SELECT duration FROM subcriptions
                WHERE sub_id = ?`, 
            [sub_id]);

            if (sub.length === 0) throw new Error("Subcription package not found!")

            switch (sub[0].duration) {
                case 'weekly':
                    expire_at.setDate(expire_at.getDate() + 7)
                    break;
                case 'monthly':
                    expire_at.setMonth(expire_at.getMonth() + 1)
                    break;
                case 'yearly':
                    expire_at.setFullYear(expire_at.getFullYear() + 1)
                    break;
                default:
                    throw new Error("Invalid subcription duration!")
            }
            const [newReg] = await transaction.query(`
                INSERT INTO subcribe (customer_id, sub_id, subcribe_at, expire_at)
                VALUE (?, ?, ?, ?)
            `, [uid, sub_id, new Date(today), expire_at])

            const [promos] = await transaction.query(`
                SELECT promo_id, quantity FROM given_promo
                WHERE sub_id = ?`,
            [sub_id]);

            for (const promo of promos) {
                const { promo_id, quantity } = promo
                await transaction.query(`
                    INSERT INTO customer_promo (uid, promo_id, quantity)
                    VALUE (?, ?, ?)
                `, [uid, promo_id, quantity])
            }

            await transaction.commit()
            return newReg.affectedRows ? { customer_id: uid, sub_id, start_at: today, expire_at: expire_at.toISOString() } : null
        } catch (error) {
            await transaction.rollback()
            throw new Error(error.message)
        }
        finally {
            transaction.release()
        }
    }

    async getUserSubcriptions(uid) {
        try {
            const [subs] = await pool.query(`
                SELECT s.sub_id, s.title, s.description, s.duration, s.price, sc.subcribe_at, sc.expire_at
                FROM subcribe sc
                JOIN subcriptions s ON sc.sub_id = s.sub_id
                WHERE sc.customer_id = ? AND sc.expire_at > ?
            `, [uid, new Date().toISOString()])
            return subs
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getSubcriptionById(sub_id) {
        try {
            const [subs] = await pool.query(`
                SELECT * 
                FROM subcriptions as s
                JOIN subcribe_pack as sp ON s.sub_id = sp.sub_id
                JOIN products as p ON sp.pid = p.pid
                JOIN given_promo as gp ON s.sub_id = gp.sub_id
                JOIN promotions as pr ON gp.promo_id = pr.promo_id
                WHERE s.sub_id = ?
            `, [sub_id])
            
            const subMap = new Map()
            for (const row of subs) {
                if (!subMap.has(row.sub_id)) {
                    subMap.set(row.sub_id, {
                        sub_id: row.sub_id,
                        title: row.title,
                        description: row.description,
                        duration: row.duration,
                        price: row.price,
                        products: [],
                        promotions: []
                    })
                }
                const sub = subMap.get(row.sub_id)
                sub.products.push({
                    product_id: row.pid,
                    name: row.name,
                    description: row.description,
                    price: row.price,
                    quantity: row.quantity
                })
                sub.promotions.push({
                    promo_id: row.promo_id,
                    code: row.code,
                    description: row.description,
                    discount_percent: row.discount_percent,
                    quantity: row.quantity
                })
            }

            return subMap.size > 0 ? Array.from(subMap.values())[0] : null
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateSubcription(sub_id, data) {
        try {
            const { title, description, duration, price } = data
            const [updatedSub] = await pool.query(`
                UPDATE subcriptions
                SET title = COALESCE(?, title), description = COALESCE(?, description), duration = COALESCE(?, duration), price = COALESCE(?, price)
                WHERE sub_id = ?
            `, [title, description, duration, price, sub_id])
            return updatedSub.affectedRows ? { sub_id, ...data } : null
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = new SubcriptionService()