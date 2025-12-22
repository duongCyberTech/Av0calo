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

// Tạo đơn hàng
export const createOrder = async (orderData) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON('/orders', {
            method: 'POST',
            headers,
            body: orderData
        });
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async () => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON('/orders', {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (oid) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/orders/${oid}`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

// Hủy đơn hàng
export const cancelOrder = async (oid) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/orders/${oid}/cancel`, {
            method: 'PUT',
            headers
        });
    } catch (error) {
        console.error('Error canceling order:', error);
        throw error;
    }
};


