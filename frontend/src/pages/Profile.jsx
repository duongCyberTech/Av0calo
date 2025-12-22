import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getUserById, updateUser, getCurrentUserId, isAuthenticated } from '../services/userService';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        phone: '',
        username: '',
        email: ''
    });

    // Check authentication và redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const userId = getCurrentUserId();
        if (!userId) {
            setError('Không thể lấy thông tin người dùng');
            return;
        }

        loadUserData(userId);
    }, [navigate]);

    // Load thông tin user từ backend
    const loadUserData = async (userId) => {
        setLoading(true);
        setError('');

        try {
            const userData = await getUserById(userId);
            setUser(userData);
            setFormData({
                fname: userData.fname || '',
                lname: userData.lname || '',
                phone: userData.phone || '',
                username: userData.username || '',
                email: userData.email || ''
            });
        } catch (err) {
            console.error('Error loading user data:', err);
            setError(err.body?.message || `Lỗi tải dữ liệu (${err.status})`);

            // Nếu unauthorized, redirect về login
            if (err.status === 401 || err.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    // Xử lý lưu thông tin
    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const userId = getCurrentUserId();
        if (!userId) {
            setError('Không thể lấy thông tin người dùng');
            setSaving(false);
            return;
        }

        try {
            // Chỉ gửi những field có thể update (không bao gồm email)
            const updateData = {
                fname: formData.fname,
                lname: formData.lname,
                phone: formData.phone,
                username: formData.username
            };

            await updateUser(userId, updateData);
            setSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false);

            // Reload data để đảm bảo hiển thị đúng
            await loadUserData(userId);

        } catch (err) {
            console.error('Error updating user:', err);
            setError(err.body?.message || `Lỗi cập nhật (${err.status})`);
        } finally {
            setSaving(false);
        }
    };

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');

        // Reset form về dữ liệu gốc
        if (user) {
            setFormData({
                fname: user.fname || '',
                lname: user.lname || '',
                phone: user.phone || '',
                username: user.username || '',
                email: user.email || ''
            });
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F1F8E9] min-h-screen">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#237928] mx-auto"></div>
                        <p className="mt-4 text-[#237928] text-lg">Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F1F8E9] text-gray-700 min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-black">
                    <div className="text-center mb-8">
                        <h2 className="text-[48px] text-black font-bold">
                            THÔNG TIN CÁ NHÂN
                        </h2>
                        <div className="mt-4 border-t border-black"></div>
                    </div>

                    {/* Hiển thị thông báo */}
                    {error && (
                        <div className="mb-6 px-4 py-3 text-red-600 text-center bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 px-4 py-3 text-green-600 text-center bg-green-100 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Họ và Tên */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fname" className="block text-black mb-2 font-medium">
                                    Họ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="fname"
                                    name="fname"
                                    type="text"
                                    required
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border ${isEditing
                                        ? 'bg-[#F1F8E9] focus:outline-none focus:ring-2 focus:ring-[#A8D08D] border-gray-300'
                                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                        } text-black`}
                                    placeholder="Nhập họ"
                                    value={formData.fname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="lname" className="block text-black mb-2 font-medium">
                                    Tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lname"
                                    name="lname"
                                    type="text"
                                    required
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border ${isEditing
                                        ? 'bg-[#F1F8E9] focus:outline-none focus:ring-2 focus:ring-[#A8D08D] border-gray-300'
                                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                        } text-black`}
                                    placeholder="Nhập tên"
                                    value={formData.lname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-black mb-2 font-medium">
                                Tên người dùng <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl border ${isEditing
                                    ? 'bg-[#F1F8E9] focus:outline-none focus:ring-2 focus:ring-[#A8D08D] border-gray-300'
                                    : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                    } text-black`}
                                placeholder="Nhập tên người dùng"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email (readonly) */}
                        <div>
                            <label htmlFor="email" className="block text-black mb-2 font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                disabled
                                className="w-full px-4 py-3 rounded-xl border bg-gray-100 border-gray-200 cursor-not-allowed text-gray-600"
                                placeholder="Email không thể thay đổi"
                                value={formData.email}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Email không thể thay đổi sau khi đã đăng ký
                            </p>
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label htmlFor="phone" className="block text-black mb-2 font-medium">
                                Số điện thoại
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl border ${isEditing
                                    ? 'bg-[#F1F8E9] focus:outline-none focus:ring-2 focus:ring-[#A8D08D] border-gray-300'
                                    : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                    } text-black`}
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-4 pt-6">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 bg-[#91EAAF] text-[#237928] text-xl font-bold py-3 px-6 rounded-xl hover:bg-[#4CAF50] hover:text-white focus:outline-none transition-all transform hover:-translate-y-1"
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    CHỈNH SỬA
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex-1 bg-gray-300 text-gray-700 text-xl font-bold py-3 px-6 rounded-xl hover:bg-gray-400 focus:outline-none transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        HỦY
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-[#91EAAF] text-[#237928] text-xl font-bold py-3 px-6 rounded-xl hover:bg-[#4CAF50] hover:text-white focus:outline-none transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                ĐANG LƯU...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-2"></i>
                                                LƯU
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>

                    {/* Navigation back */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#2E4A26] hover:text-[#6E8B3D] text-lg font-medium"
                        >
                            ← Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;