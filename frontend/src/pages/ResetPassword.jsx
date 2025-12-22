import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// No API call needed here per request

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Thiếu email. Vui lòng thực hiện lại từ bước quên mật khẩu.");
            return;
        }
        if (!passwordRegex.test(password)) {
            setError(
                "Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
            );
            return;
        }
        if (password !== confirm) {
            setError("Xác nhận mật khẩu không khớp");
            return;
        }

        // Không gọi API; điều hướng sang trang thành công
        navigate("/reset-success", { state: { email } });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#B0F2C2] text-gray-700">
            <div className="relative flex flex-grow items-center justify-center px-8 py-12 sm:px-6 lg:px-8">
                <div className="flex-center relative z-10 w-[704px] space-y-5 rounded-2xl border border-black bg-white p-8">
                    <div className="text-center">
                        <h2 className="mt-2 text-[42px] text-black">ĐẶT MẬT KHẨU MỚI</h2>
                        <p className="mt-2 text-[16px] font-light italic text-gray-500">
                            Nhập mật khẩu mới của bạn. Chắc chắn rằng khác với mật khẩu cũ.
                        </p>
                    </div>
                    <div className="relative flex items-center px-3">
                        <div className="flex-grow border-t border-black"></div>
                    </div>

                    {message && (
                        <div className="rounded-lg bg-green-100 px-3 py-2 text-green-700">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="rounded-lg bg-red-100 px-3 py-2 text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                className="bg-[#F1F8E9] w-full rounded-xl px-5 py-3 text-[18px] focus:outline-none focus:ring-[#A8D08D] has-right-icon"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                onClick={() => setShowPw((s) => !s)}
                                aria-label="toggle password"
                            >
                                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showCf ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                className="bg-[#F1F8E9] w-full rounded-xl px-5 py-3 text-[18px] focus:outline-none focus:ring-[#A8D08D] has-right-icon"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                onClick={() => setShowCf((s) => !s)}
                                aria-label="toggle confirm"
                            >
                                <i className={`fas ${showCf ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-[15px] bg-[#91EAAF] px-4 py-3 text-[24px] font-bold text-[#237928] transition-all hover:-translate-y-1 hover:bg-[#4CAF50] disabled:opacity-50"
                        >
                            {loading ? "Đang cập nhật..." : "CẬP NHẬT"}
                        </button>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default ResetPassword;