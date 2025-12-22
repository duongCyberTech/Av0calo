import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const oid = searchParams.get("oid");

  const handleContinue = () => {
    navigate("/");
  };

  // Hiển thị màn hình thành công khi có success=true
  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-[#91EAAF]">
        {/* Logo Section */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-[#2E4A26]" style={{ fontFamily: 'sans-serif', fontWeight: 700 }}>
              av<span className="relative inline-block">
                <span className="relative">
                  <span className="text-[#2E4A26]">o</span>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#457C63]"></span>
                </span>
              </span>calo
            </span>
          </div>
          <div className="relative bg-[#2E4A26] text-white px-5 py-2 text-xs font-medium inline-block" 
               style={{ 
                 clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                 borderRadius: '4px'
               }}>
            Zero Calo - Zero Waste
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-grow items-center justify-center px-8 py-12 sm:px-6 lg:px-8">
          <div className="relative z-10 w-full max-w-[704px] bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
              {/* Checkmark Icon */}
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#2E4A26]" style={{ borderWidth: '2px' }}>
                <Check className="h-14 w-14 text-[#2E4A26]" strokeWidth={3} />
              </div>

              {/* Success Title */}
              <h2 className="mb-4 text-[32px] font-bold text-[#2E4A26]" style={{ fontFamily: 'sans-serif' }}>
                Thành công
              </h2>

              {/* Success Messages */}
              <p className="mb-2 text-gray-700 text-base font-normal">
                Chúc mừng quý khách đã thanh toán thành công.
              </p>
              <p className="mb-8 text-gray-600 text-base font-normal">
                Nhấn TIẾP TỤC để khám phá thêm.
              </p>

              {/* Continue Button */}
              <div className="px-3">
                <button
                  onClick={handleContinue}
                  className="w-full transform rounded-xl bg-[#91EAAF] py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#74D978] hover:shadow-lg"
                  style={{ borderRadius: '12px' }}
                >
                  TIẾP TỤC
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có success=true, có thể hiển thị danh sách đơn hàng (tùy chọn)
  return (
    <div className="bg-[#F9FBF7] min-h-screen">
      <div className="pt-24 text-center py-16">
        <p className="text-xl text-gray-600 mb-4">Danh sách đơn hàng</p>
        <p className="text-gray-500">Tính năng đang được phát triển...</p>
      </div>
    </div>
  );
};

export default Orders;

