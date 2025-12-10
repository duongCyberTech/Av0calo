const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Cổng SMTPS/SSL
    secure: true, // BẮT BUỘC là TRUE khi dùng cổng 465
    auth: {
        user: process.env.MAIL_ACCOUNT, 
        pass: process.env.MAIL_PASS // Phải là MẬT KHẨU ỨNG DỤNG của Gmail
    },
    timeout: 120000, // 60 giây (mặc định là 30 giây)
    connectionTimeout: 120000,
    socketTimeout: 120000,
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Lỗi kết nối cấu hình:", error);
    } else {
        console.log("Cấu hình đúng rồi! Sẵn sàng gửi mail.");
    }
});

module.exports = transporter;