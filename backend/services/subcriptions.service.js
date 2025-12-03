const pool = require('../config/db')
const { uuidv7: uuid } = require('uuidv7')
const { checkExist } = require('../utils/utils')

class SubcriptionService {
    async createSubcription(data) {
        try {
            const { title, description, duration, price, promo_lst, product_lst } = data
            if (!title || !price || !product_lst) throw new Error("Missing fields!")
            
            const isExisted = await checkExist('subcriptions', 'title', title)
            if (!isExisted) throw new Error("The subcription has already been created!")
            
            const id = uuid()
            const [newSub] = await pool.query(`
                INSERT INTO subcriptions
                VALUE (?, ?, ?, ?, ?)
            `, [id, title, description || "", duration || "weekly", price])

            for (const promo_id of promo_lst || []) {
                await pool.query(`
                    INSERT INTO subcription_promotions (sub_id, promo_id)
                    VALUE (?, ?)
                `, [id, promo_id])
            }

            return newSub.affectedRows ? { ...data, sub_id: id } : null
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = new SubcriptionService()