import { fetchJSON } from '../utils/api';

// Lấy token từ localStorage để authenticate
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null; // Trả về null thay vì throw error để có thể xử lý linh hoạt
    }
    return {
        'Authorization': `Bearer ${token}`
    };
};

// Lấy danh sách tất cả subscriptions
export const getAllSubscriptions = async (duration = null) => {
    try {
        const headers = getAuthHeaders();
        if (!headers) {
            // Nếu chưa đăng nhập, throw error với status 401
            throw { status: 401, body: { message: 'Vui lòng đăng nhập để xem các gói đăng ký' } };
        }
        const params = duration ? `?duration=${encodeURIComponent(duration)}` : '';
        return await fetchJSON(`/subcriptions${params}`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
    }
};

// Lấy thông tin subscription theo ID
export const getSubscriptionById = async (subId) => {
    try {
        const headers = getAuthHeaders();
        if (!headers) {
            throw { status: 401, body: { message: 'Vui lòng đăng nhập để xem chi tiết gói đăng ký' } };
        }
        return await fetchJSON(`/subcriptions/${subId}`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching subscription by id:', error);
        throw error;
    }
};

// Lấy subscriptions của user hiện tại
export const getUserSubscriptions = async () => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/subcriptions/user/me`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        throw error;
    }
};

// Thanh toán cho subscription
export const paySubscription = async (subId, bankCode = "NCB") => {
    try {
        const headers = getAuthHeaders();
        if (!headers) {
            throw { status: 401, body: { message: 'Vui lòng đăng nhập để thanh toán' } };
        }
        // Backend có thể nhận bankCode qua query hoặc body, tạm thời dùng query
        const response = await fetchJSON(`/subcriptions/pay/${subId}?bankCode=${encodeURIComponent(bankCode)}`, {
            method: 'POST',
            headers
        });
        return response.url; // URL thanh toán VNPay
    } catch (error) {
        console.error('Error paying subscription:', error);
        throw error;
    }
};

