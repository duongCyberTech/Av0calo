import React, { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";

const SignupSuccess = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = location.state?.email || "Bachkhoatuiiu@hcmut.edu.vn";

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#91EAAF] text-gray-700">
      <Nav />

      <div className="relative flex flex-grow items-center justify-center px-8 py-12 text-[20px] text-black sm:px-6 lg:px-8">
        <div className="flex-center relative z-10 h-auto w-[704px] items-center space-y-2 rounded-2xl border border-black bg-white p-8">
          <div className="animate-fade-in text-center">
            {/* Vòng tròn Checkmark */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#20CB7B]">
              <Check className="h-12 w-12 text-[#457C63]" strokeWidth={3} />
            </div>

            <h2 className="mb-2 text-[32px] font-bold">Thành công</h2>

            <p className="mb-10 font-light italic">
              Chọn ĐĂNG NHẬP NGAY để đăng nhập
            </p>

            <div className="px-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full transform rounded-xl bg-[#91EAAF] py-3 text-lg font-bold tracking-wide text-[#237928] transition-all hover:-translate-y-1 hover:bg-[#4CAF50]"
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
