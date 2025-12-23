import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SubSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="flex min-h-screen flex-col bg-[#B0F2C2] text-gray-700">
      <div className="relative flex flex-grow items-center justify-center px-8 py-12 sm:px-6 lg:px-8">
        <div className="flex-center relative z-10 w-[704px] space-y-6 rounded-2xl border border-black bg-white p-10 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#59C26B]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="#59C26B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-[32px] font-bold text-black">Thành công</h2>
            <p className="mt-2 text-[16px] font-light italic text-gray-600">
              Chúc mừng quý khách đã đăng ký thành công Subscription Box
              <br />
              GÓI GIA ĐÌNH.
              <br />
              Nhấn TIẾP TỤC để khám phá thêm.
            </p>
          </div>
          <button
            onClick={() => navigate("/", { state: { email } })}
            className="w-full rounded-[15px] bg-[#91EAAF] px-4 py-3 text-[22px] font-bold text-[#237928] transition-all hover:-translate-y-1 hover:bg-[#4CAF50]"
          >
            TIẾP TỤC
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubSuccess;
