const nodemailer = require('nodemailer');
const transporter = require('../config/email.config');
const redis = require('../config/redis.config');
const { generateOTP, getHtmlContent } = require('../utils/utils');


require('dotenv').config();

class AuthService {
    async sendOTPEmail(toEmail, data) {
        try {
            const otp = generateOTP();
            const htmlContent = getHtmlContent({ name: data.name, otp });

            // Lưu OTP vào Redis với thời hạn 5 phút (300 giây)
            await redis.setex(`otp:${toEmail}`, 300, otp);

            const mailOptions = {
                from: `Av0calo Team <${process.env.MAIL_ACCOUNT}>`,
                to: process.env.RECEIVER_EMAIL,
                subject: 'Your OTP Code',
                html: htmlContent
            }

            const info = await transporter.sendMail(mailOptions);

            return { message: 'OTP sent successfully', info };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async verifyOTP(toEmail, otp){
        try {
            const storedOTP = await redis.get(`otp:${toEmail}`);
            if(storedOTP && storedOTP === otp){
                // Xoá OTP sau khi xác thực thành công
                await redis.del(`otp:${toEmail}`);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new AuthService();