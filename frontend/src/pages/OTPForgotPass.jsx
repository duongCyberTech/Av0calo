import React, { useState } from "react";
import Nav from "../components/Nav.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";

const OTPForgotPass = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    // const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userEmail = location.state?.email || "Bachkhoatuiiu@hcmut.edu.vn";

    const handleChange = (element, index) => {
        const value = element.value;
        if (isNaN(value)) return false;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key == "Backspace") {
            if (!otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                if (prevInput) prevInput.focus();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length < 6) {
            alert("Vui lòng nhập đủ 6 số!");
            return;
        }
        navigate("/signup-success", { state: { email: userEmail } });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#91EAAF] text-gray-700">
            {/* <Nav /> */}

            <div className="relative flex flex-grow items-center justify-center px-8 py-12 sm:px-6 lg:px-8">
                <div className="flex-center relative z-10 h-[650px] w-[704px] items-center space-y-2 rounded-2xl border border-black bg-white p-8">
                    <div className="mb-6 text-center">
                        <h2 className="mt-2 text-[48px] text-black">Xác thực OTP</h2>
                        <p className="text-[32px] font-light italic text-gray-500">
                            Kiểm tra email của bạn!
                        </p>
                    </div>
                    <div className="relative flex items-center px-3">
                        <div className="flex-grow border-t border-black"></div>
                    </div>

                    {/* Thông báo Email */}
                    <div className="py-5 text-center text-[20px]">
                        <p className="p-3 font-light">Nhập mã OTP 6 số đã được gửi về</p>
                        <p className="break-words text-[20px]">{userEmail}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-10 flex justify-center gap-3">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    className="h-14 w-11 rounded-lg border-none bg-[#F1F8E9] text-center text-xl font-bold text-black shadow-inner outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#A8D08D]"
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                />
                            ))}
                        </div>

                        {/* Link gửi lại */}
                        <div className="mb-8 text-center text-[20px] text-black">
                            <div className="font-light">Bạn chưa nhận được mã OTP?</div>
                            <button
                                type="button"
                                className="mt-1 transition-colors hover:text-[#2E4A26] hover:underline"
                            >
                                Gửi lại mã
                            </button>
                        </div>

                        {/* Nút Xác Nhận */}
                        <button
                            type="submit"
                            className="item-center group relative w-full transform justify-center rounded-[15px] bg-[#91EAAF] px-4 py-3 text-[32px] font-bold text-[#237928] transition-all hover:-translate-y-1 hover:bg-[#4CAF50] focus:outline-none"
                        >
                            XÁC NHẬN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPForgotPass;
