const pool = require('../config/db')
const bcrypt = require('bcrypt')
const {checkExist} = require('../utils/utils')
const {uuidv7: uuid} = require('uuidv7')

class UserService {
    async createUser(data){
        try {
            const { fname, lname, username, role, status, email, password, phone } = data
            if (!fname || !lname || !username || !email || !password) throw new Error("Missing fields!")

            const checkUser = await checkExist('users', 'email', email);
            if (checkUser) throw new Error("This account has existed!")
            
            const uid = uuid()
            const hashPassword = await bcrypt.hash(password, 12)

            const newUser = await pool.query(`
                    INSERT INTO users
                    VALUE(?, ?, ?, ?, ?, ?, ?, ?, ?) 
                `,[uid, fname, lname, username, role || 'customer', status || 1, email, hashPassword, phone || null])
            
            return newUser[0].affectedRows ? { uid } : null
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserByEmail(email) {
        try {
            const [user] = await pool.query(`
                    SELECT uid, fname, lname, username, role, status, phone
                    FROM users
                    WHERE email = ? 
                `, [email])
                
            return user && user.length ? user[0] : null
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = new UserService()