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

// Lấy thông tin user theo ID
export const getUserById = async (userId) => {
    try {
        const headers = getAuthHeaders();
        return await fetchJSON(`/users/${userId}`, {
            method: 'GET',
            headers
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    try {
        const authHeaders = getAuthHeaders();
        console.log('Sending update request with data:', userData);
        return await fetchJSON(`/users/${userId}`, {
            method: 'PUT',
            headers: {
                ...authHeaders
            },
            body: userData
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Lấy thông tin user hiện tại từ token (decode JWT để lấy userId)
export const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // Decode JWT token để lấy user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.uid || payload.userId || payload.id;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check nếu user đã đăng nhập
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
};
