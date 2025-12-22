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

// Lấy danh sách địa chỉ của user
export const getAddresses = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetchJSON('/addresses', {
            method: 'GET',
            headers
        });
        return response || [];
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

// Thêm địa chỉ mới
export const createAddress = async (addressData) => {
    try {
        const headers = getAuthHeaders();
        const response = await fetchJSON('/addresses', {
            method: 'POST',
            headers,
            body: addressData
        });
        return response.data || response;
    } catch (error) {
        console.error('Error creating address:', error);
        throw error;
    }
};

// Cập nhật địa chỉ
export const updateAddress = async (aid, addressData) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/addresses/${aid}`, {
            method: 'PUT',
            headers,
            body: addressData
        });
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

// Xóa địa chỉ
export const deleteAddress = async (aid) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/addresses/${aid}`, {
            method: 'DELETE',
            headers
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
};

