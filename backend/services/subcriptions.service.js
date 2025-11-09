const pool = require('../config/db')
const { uuidv7: uuid } = require('uuidv7')
const { checkExist } = require('../utils/utils')

class SubcriptionService {
    async createSubcription(data) {
        const connection =  await pool.getConnection()
        await connection.beginTransaction()
        try {
            const { title, description, duration, price, product_list, promotion_list } = data
            if (!title || !price || !product_list || !product_list.length) throw new Error("Missing fields!")
            
            const isExisted = await checkExist('subcriptions', 'title', title)
            if (!isExisted) throw new Error("The subcription has already been created!")
            
            const id = uuid()
            const [newSub] = await connection.query(`
                INSERT INTO subcriptions
                VALUE (?, ?, ?, ?, ?)
            `, [id, title, description || "", duration || "weekly", price])

            for (const item of product_list){
                await connection.query(`
                    INSERT INTO subcribe_pack
                    VALUE (?, ?, ?)
                `,[id, item.pid, item.quantity])
            }

            for (const item of promotion_list){
                await connection.query(`
                    INSERT INTO given_promo
                    VALUE (?, ?, ?)
                `,[id, item.promo_id, item.quantity])
            }

            await connection.commit()

            return newSub.affectedRows ? { ...data, sub_id: id } : null
        } catch (error) {
            await connection.rollback()
            throw new Error(error.message)
        } finally {
            await connection.release()
        }
    }
}

module.exports = new SubcriptionService()