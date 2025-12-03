const pool = require('../config/db')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function checkExist(table, column, value){
    const [res] = await pool.query(`
        SELECT ${column} 
        FROM ${table} 
        WHERE ${column} = ?
    `,[value])

    return res && res.length ? true : false
}

function generateOTP() {
    const secureRandom = crypto.randomInt(100000, 999999).toString();
    return secureRandom;
}

const getHtmlContent = (data) => {
    // 1. Xác định đường dẫn file (Dùng path.join để tránh lỗi đường dẫn trên Windows/Linux)
    const filePath = path.join(__dirname, 'template', 'mail.template.html');

    // 2. Đọc file (dùng readFileSync cho đơn giản, hoặc readFile nếu muốn async)
    let html = fs.readFileSync(filePath, 'utf-8');

    // 3. Thay thế các biến {{key}} bằng dữ liệu thật
    // Lưu ý: .replace chỉ thay thế ký tự đầu tiên tìm thấy. 
    // Nếu biến xuất hiện nhiều lần, hãy dùng .replaceAll()
    html = html.replace('&lt;user_name&gt;', data.name);
    html = html.replace('&lt;otp_code&gt;', data.otp);

    return html;
};

module.exports = {
    checkExist,
    generateOTP,
    getHtmlContent
}