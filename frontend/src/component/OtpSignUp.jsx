import React, { useState, useEffect } from 'react';
import Nav from './Nav.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const[isSuccess, setIsSuccess] = useState(false);
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
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      alert("Vui lòng nhập đủ 6 số!");
      return;
    }
    setIsSuccess(true);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  }

  return (
    <div className="bg-[#91EAAF] text-gray-700 min-h-screen flex flex-col">
      <Nav />

      <div className="flex-grow flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8 relative">
        <div className="flex-center w-[704px] h-[650px] space-y-2 items-center bg-white p-8 rounded-2xl relative z-10 border border-black">
          {isSuccess ? (
            // --- GIAO DIỆN THÀNH CÔNG (Giống hình mẫu) ---
            <div className="text-center animate-fade-in">
              {/* Vòng tròn Checkmark */}
              <div className="mx-auto mb-6 w-24 h-24 rounded-full border-4 border-[#50C878] flex items-center justify-center">
                <Check className="text-[#50C878] w-12 h-12" strokeWidth={3} />
              </div>

              <h2 className="text-2xl font-bold text-black mb-2 font-['Quicksand']">
                Thành công
              </h2>

              <p className="text-gray-500 text-sm mb-10">
                Chọn <span className="font-bold">ĐĂNG NHẬP NGAY</span> để đăng nhập
              </p>

              <button
                onClick={handleLoginRedirect}
                className="bg-[#91EAAF] hover:bg-[#7ed69e] text-[#2E4A26] text-lg font-bold w-full py-3 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg uppercase tracking-wide"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </div>
          ) : (
            // --- GIAO DIỆN NHẬP OTP (Cũ) ---
            <>
          <div className="text-center mb-6">
            <h2 className="mt-2 text-[48px] text-black">
              Xác thực OTP
            </h2>
            <p className="text-gray-500 italic text-[32px] font-light">
              Kiểm tra email của bạn!
            </p>
          </div>
          <div className="relative flex items-center px-3">
            <div className="flex-grow border-t border-black"></div>
          </div>

          {/* Thông báo Email */}
          <div className="text-center text-[20px] py-5">
            <p className="font-light p-3">
              Nhập mã OTP 6 số đã được gửi về
            </p>
            <p className="text-[20px] break-words">
              {userEmail}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-10">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  className="w-11 h-14 bg-[#F1F8E9] text-center text-xl font-bold rounded-lg border-none focus:ring-2 focus:ring-[#A8D08D] focus:bg-white text-black outline-none transition-all shadow-inner"
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
            <div className="text-center mb-8 text-[20px] text-black">
              <div className='font-light'>Bạn chưa nhận được mã OTP?</div>
              <button type="button" className="hover:text-[#2E4A26] mt-1 hover:underline transition-colors">
                Gửi lại mã
              </button>
            </div>

            {/* Nút Xác Nhận */}
            <button
                type="submit"
                className="bg-[#91EAAF] text-[#237928] text-[32px] font-bold group relative w-full  item-center justify-center py-3 px-4 rounded-[15px] hover:bg-[#4CAF50] focus:outline-none transition-all transform hover:-translate-y-1"
              >
                XÁC NHẬN
              </button>
          </form>
          </>
          )}

        </div>
      </div>
    </div>
  );
};

export default OTP;
