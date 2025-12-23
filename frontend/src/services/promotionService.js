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

// Lấy danh sách các mã giảm giá khả dụng
export const getPromotions = async (search = '') => {
    try {
        const headers = getAuthHeaders();
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        return await fetchJSON(`/promotions${params}`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw error;
    }
};

