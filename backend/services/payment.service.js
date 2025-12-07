require('dotenv').config();
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const pool = require('../config/db');

class PaymentService {
  async createPayment(oid, bankCode = null, language = 'vn') {
    const TZ = process.env.TZ;

    const [rows] = await pool.query(
      `SELECT final_price, is_paid FROM orders WHERE oid = ?`,
      [oid]
    );

    if (rows.length === 0) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const order = rows[0];
    if (order.is_paid === 1) {
      throw new Error('ORDER_ALREADY_PAID');
    }

    const amount = order.final_price;

    return this.createTransaction(oid, amount, bankCode, language)
  }

  async createTransaction(oid, amount, bankCode, language = 'vn') {
    if (!bankCode) throw new Error("INFO_MISSED")

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let expireDate = moment(date).add(10, 'minutes').format('YYYYMMDDHHmmss');

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = language;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = `${oid}_${moment(date).format('HHmmss')}`;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + oid;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate;
    vnp_Params['vnp_BankCode'] = bankCode;
    vnp_Params = this.sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
  }

  async verifyReturn(vnp_Params) {
    let secureHash = vnp_Params['vnp_SecureHash'];
    let secretKey = process.env.vnp_HashSecret;
    const txnRef = vnp_Params['vnp_TxnRef'].split('_')[0];
    // Xóa 2 tham số hash trước khi tính toán lại
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại
    vnp_Params = this.sortObject(vnp_Params);

    // Mã hóa lại
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Check mã lỗi (00 là thành công)
      if (vnp_Params['vnp_ResponseCode'] === '00') {
        return {
          isSuccess: true,
          message: 'Giao dịch thành công',
          oid: txnRef,
        };
      } else {
        return {
          isSuccess: false,
          message: 'Giao dịch thất bại/Hủy bỏ',
          oid: txnRef,
        };
      }
    } else {
      return {
        isSuccess: false,
        message: 'Chữ ký không hợp lệ (Dữ liệu bị sửa đổi)',
        oid: null,
      };
    }
  }
  sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      const decodedKey = decodeURIComponent(str[key]);
      sorted[str[key]] = encodeURIComponent(obj[decodedKey]).replace(
        /%20/g,
        '+'
      );
      // sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}

module.exports = new PaymentService();
