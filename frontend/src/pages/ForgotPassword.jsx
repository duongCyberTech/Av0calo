import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../utils/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetchJSON('/auth/send-otp', {
                method: 'POST',
                body: { email },
            });
            setMessage(res?.message || 'Đã gửi OTP vào email của bạn.');
            // Điều hướng tới trang nhập OTP nếu gửi thành công
            navigate("/send-otp-forgotpass", { state: { email } });
        } catch (err) {
            const msg = typeof err.body === 'string' ? err.body : err.body?.message;
            setError(msg || (err.status ? `Gửi OTP thất bại (${err.status})` : 'Gửi OTP thất bại'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#B0F2C2] min-h-screen flex items-center justify-center px-4">
            <div className="bg-white w-[700px] rounded-2xl border border-black p-10 text-center shadow-md">

                {/* Title */}
                <h1 className="text-[42px] font-semibold text-black tracking-wide">
                    QUÊN MẬT KHẨU
                </h1>

                {/* Line */}
                <div className="my-3">
                    <div className="border-t border-black w-full mx-auto"></div>
                </div>

                {/* Subtitle */}
                <p className="text-gray-600 text-[18px] mb-8 italic font-light">
                    Vui lòng nhập email để thiết lập lại mật khẩu
                </p>
                {message && (
                    <div className="mb-4 rounded-lg bg-green-100 px-3 py-2 text-green-700 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email Input */}
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (*)"
                        className="w-full bg-[#F1F8E9] px-5 py-3 rounded-xl text-[18px]
                                   placeholder-gray-400 placeholder:font-light
                                   border border-transparent focus:outline-none focus:border-[#A8D08D]"
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#91EAAF] hover:bg-[#6AD78A] transition-all py-3 rounded-xl text-[28px] font-bold text-[#1E6B23] disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'GỬI OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;