const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Email người gửi
        user: process.env.MAIL_ACCOUNT, 
        
        // MẬT KHẨU ỨNG DỤNG 16 ký tự (cái mà bạn đang tìm cách lấy)
        // Tuyệt đối không dùng mật khẩu đăng nhập Gmail ở đây
        pass: process.env.MAIL_PASS 
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Lỗi kết nối cấu hình:", error);
    } else {
        console.log("Cấu hình đúng rồi! Sẵn sàng gửi mail.");
    }
});

module.exports = transporter;