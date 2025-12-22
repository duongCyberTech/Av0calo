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

// Lấy giỏ hàng
export const getCart = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetchJSON('/cart', {
            method: 'GET',
            headers
        });
        return response.data || [];
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (pid, quantity) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON('/cart', {
            method: 'POST',
            headers,
            body: { pid, quantity }
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (pid, quantity) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON('/cart', {
            method: 'PUT',
            headers,
            body: { pid, quantity }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (pid) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/cart/${pid}`, {
            method: 'DELETE',
            headers
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON('/cart', {
            method: 'DELETE',
            headers
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

