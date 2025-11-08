const pool = require('../config/db')
const { uuidv7: uuid } = require('uuidv7')
const { checkExist } = require('../utils/utils')

class SubcriptionService {
    async createSubcription(data) {
        try {
            const { title, description, duration, price } = data
            if (!title || !price) throw new Error("Missing fields!")
            
            const isExisted = await checkExist('subcriptions', 'title', title)
            if (!isExisted) throw new Error("The subcription has already been created!")
            
            const id = uuid()
            const [newSub] = await pool.query(`
                INSERT INTO subcriptions
                VALUE (?, ?, ?, ?, ?)
            `, [id, title, description || "", duration || "weekly", price])

            return newSub.affectedRows ? { ...data, sub_id: id } : null
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = new SubcriptionService()