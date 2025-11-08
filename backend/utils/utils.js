const pool = require('../config/db')

async function checkExist(table, column, value){
    const [res] = await pool.query(`
        SELECT ${column} 
        FROM ${table} 
        WHERE ${column} = ?
    `,[value])

    return res && res.length ? true : false
}

module.exports = {
    checkExist
}