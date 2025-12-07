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
    connectionTimeout:60000
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Lỗi kết nối cấu hình:", error);
    } else {
        console.log("Cấu hình đúng rồi! Sẵn sàng gửi mail.");
    }
});

module.exports = transporter;