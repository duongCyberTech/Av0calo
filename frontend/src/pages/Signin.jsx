import React, { useState } from 'react';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';
import { fetchJSON } from '../utils/api';

const SignIn = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await fetchJSON('/auth/login', {
                method: 'POST',
                body: formData,
            });
            console.log('login result:', result);

            // lưu token vào localStorage
            if (result.token) {
                localStorage.setItem('token', result.token);
            }

            // điều hướng về home
            navigate('/', { state: { email: formData.email } });
        } catch (err) {
            console.error('login error:', err);
            setError(err.body?.message || `Lỗi đăng nhập (${err.status})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#91EAAF] text-gray-700 min-h-screen flex flex-col">
            <div className="flex-grow flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8 relative">
                <div className="flex-center w-[704px] h-auto space-y-2 items-center bg-white p-8 rounded-2xl relative z-10 border border-black">
                    <div className="text-center">
                        <h2 className="mt-2 text-[48px] text-black">
                            ĐĂNG NHẬP
                        </h2>
                    </div>

                    <div className="relative flex items-center px-3">
                        <div className="flex-grow border-t border-black"></div>
                    </div>

                    {error && (
                        <div className="px-3 py-2 text-red-600 text-center bg-red-100 rounded-lg w-full">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5 rounded-md shadow-sm px-3 -space-y-px text-[20px]">
                            {/* Email */}
                            <div>
                                <div className='flex justify-between items-center gap-2 px-5'>
                                    <label htmlFor="email" className="block font-extralight text-black mb-1">Email (*)</label>
                                    <i className="fa-solid fa-envelope"></i>
                                </div>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className='flex justify-between items-center gap-2 px-5'>
                                    <label htmlFor="password" className="block font-extralight text-black mb-1">Mật khẩu (*)</label>
                                    <i className="fas fa-lock text-black text-gray-600"></i>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="text-right px-5 mt-1">
                                <a href="/forgot-password" className="text-[#045456] hover:text-[#6E8B3D] text-[18px] text-sm">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <div className='px-3'>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#91EAAF] text-[#237928] text-[32px] font-bold group relative w-full item-center justify-center py-3 px-4 rounded-[15px] hover:bg-[#4CAF50] focus:outline-none transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                            </button>
                        </div>

                        <div className='px-3'>
                            <button
                                type="button"
                                className="bg-[#E2F5E3] text-[#000000] group relative w-full flex justify-center py-3 px-4 rounded-[15px] hover:bg-[#C9DFDF] focus:outline-none transition-all transform hover:-translate-y-1"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i className="fab fa-google text-red-500 mr-2"></i>
                                </span>
                                Đăng nhập với Google
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 py-">
                            Bạn chưa có tài khoản?{' '}
                            <a href="/register" className="text-[#2E4A26] hover:text-[#6E8B3D]">
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;