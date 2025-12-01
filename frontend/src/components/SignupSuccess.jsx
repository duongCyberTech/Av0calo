import React, { useState, useEffect } from 'react';
import Nav from './Nav.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const SignupSuccess = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const[isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = location.state?.email || "Bachkhoatuiiu@hcmut.edu.vn";

  const handleLoginRedirect = () => {
    navigate('/');
  }

  return (
    <div className="bg-[#91EAAF] text-gray-700 min-h-screen flex flex-col">
      <Nav />

      <div className="text-black text-[20px] flex-grow flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8 relative">
        <div className="flex-center w-[704px] h-auto space-y-2 items-center bg-white p-8 rounded-2xl relative z-10 border border-black">
            <div className="text-center animate-fade-in">
              {/* Vòng tròn Checkmark */}
              <div className="mx-auto mb-6 w-24 h-24 rounded-full border-4 border-[#20CB7B] flex items-center justify-center">
                <Check className="text-[#457C63] w-12 h-12" strokeWidth={3} />
              </div>

              <h2 className="text-[32px] font-bold mb-2 ">
                Thành công
              </h2>

              <p className="italic font-light mb-10">
                Chọn ĐĂNG NHẬP NGAY để đăng nhập
              </p>

            <div className='px-3'>
              <button
                onClick={handleLoginRedirect}
                className="bg-[#91EAAF] hover:bg-[#4CAF50] text-[#237928] text-lg font-bold w-full py-3 rounded-xl transition-all transform hover:-translate-y-1 tracking-wide"
              >
                ĐĂNG NHẬP NGAY
              </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
