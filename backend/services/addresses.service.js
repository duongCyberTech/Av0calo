const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
class AddressService {
    async getAllAddresses(uid) {
        const [rows] = await pool.query(
            `SELECT * FROM addresses WHERE uid = ? ORDER BY isDefault DESC`, 
            [uid]
        );
        return rows;
    }

    async getAddressById(uid, aid) {
        const [rows] = await pool.query(
            `SELECT * FROM addresses WHERE uid = ? AND aid = ?`, 
            [uid, aid]
        );
        return rows[0];
    }

    async addAddress(uid, data) {
        const { street, district, city, isDefault } = data;
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            if (isDefault) {
                await connection.query(`UPDATE addresses SET isDefault = 0 WHERE uid = ?`, [uid]);
            } else {
                const [count] = await connection.query(`SELECT COUNT(*) as total FROM addresses WHERE uid = ?`, [uid]);
                if (count[0].total === 0) data.isDefault = true; 
            }
            const aid = uuidv4(); 
            await connection.query(
                `INSERT INTO addresses (aid, uid, street, district, city, isDefault) VALUES (?, ?, ?, ?, ?, ?)`,
                [aid, uid, street, district, city, data.isDefault ? 1 : 0]
            );

            await connection.commit();
            return { aid, ...data }; 
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    async updateAddress(uid, aid, data) {
        const { street, district, city, isDefault } = data;
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();
            if (isDefault) {
                await connection.query(
                    `UPDATE addresses SET isDefault = 0 WHERE uid = ?`, 
                    [uid]
                );
            }
            await connection.query(
                `UPDATE addresses 
                 SET street = COALESCE(?, street),
                     district = COALESCE(?, district),
                     city = COALESCE(?, city),
                     isDefault = COALESCE(?, isDefault)
                 WHERE uid = ? AND aid = ?`,
                [street, district, city, isDefault, uid, aid]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteAddress(uid, aid) {
        await pool.query(`DELETE FROM addresses WHERE uid = ? AND aid = ?`, [uid, aid]);
        return true;
    }
}

module.exports = new AddressService();