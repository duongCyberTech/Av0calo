import { fetchJSON } from '../utils/api';

// Lấy token từ localStorage để authenticate
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Không tìm thấy token xác thực');
    }
    return {
        'Authorization': `Bearer ${token}`
    };
};

// Tạo URL thanh toán VNPay
export const createPaymentUrl = async (oid, bankCode, language = 'vn') => {
    try {
        const headers = getAuthHeaders();
        const response = await fetchJSON(`/payment/${oid}`, {
            method: 'POST',
            headers,
            body: { bankCode, language }
        });
        return response.paymentUrl;
    } catch (error) {
        console.error('Error creating payment URL:', error);
        throw error;
    }
};


