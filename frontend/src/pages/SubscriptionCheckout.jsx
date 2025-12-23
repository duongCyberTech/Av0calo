import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Loader, ArrowLeft, Tag, ShoppingBasket } from "lucide-react";
import {
  isAuthenticated,
  getCurrentUserId,
  getUserById,
} from "../services/userService";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscription = location.state?.subscription;

  // State quản lý dữ liệu
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [voucher, setVoucher] = useState("");

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // 2. Lấy thông tin người dùng và địa chỉ
    const loadUserInformation = async () => {
      try {
        setLoading(true);
        const userId = getCurrentUserId();
        if (userId) {
          const data = await getUserById(userId);
          setUserData(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInformation();
  }, [navigate]);

  // Xử lý khi người dùng nhấn F5 (mất state subscription)
  if (!subscription && !loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F1F8E9]">
        <h2 className="mb-4 text-2xl font-bold">
          Không tìm thấy thông tin đơn hàng
        </h2>
        <button
          onClick={() => navigate("/subscription")}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-white"
        >
          <ArrowLeft size={20} /> Quay lại chọn gói
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F1F8E9]">
        <Loader className="animate-spin text-green-700" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F8E9] font-sans text-[#2E4A26]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        {/* Điều hướng nhanh */}
        <nav className="mb-4 text-lg text-gray-600">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <span className="mx-2">/</span>
          <span className="font-bold italic text-black">Thanh toán</span>
        </nav>

        <h1 className="mb-8 font-serif text-5xl font-bold italic">
          Thanh toán
        </h1>

        {/* KHỐI ĐỊA CHỈ - Lấy từ userData */}
        <section className="mb-8 rounded-2xl border border-[#A5D6A7] bg-[#C8EBC9] p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-2xl font-bold">
            <MapPin size={28} fill="#2E4A26" />
            <span>Thông tin nhận hàng</span>
          </div>
          <div className="flex items-start justify-between pl-10">
            <div className="space-y-2 text-xl">
              <p>
                <strong>Khách hàng:</strong>{" "}
                {userData?.fullName || userData?.username || "Đang cập nhật..."}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {userData?.phoneNumber || "Chưa có SĐT"}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{" "}
                {userData?.address || "Vui lòng cập nhật địa chỉ trong hồ sơ"}
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="text-xl font-bold underline hover:text-green-800"
            >
              Thay đổi
            </button>
          </div>
        </section>

        {/* DANH SÁCH SẢN PHẨM */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 bg-[#C1F2D1] px-10 py-4 text-2xl font-bold">
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-3 text-center">Đơn giá</div>
            <div className="col-span-3 text-right">Thành tiền</div>
          </div>

          <div className="grid grid-cols-12 items-center border-b border-gray-100 px-10 py-8">
            <div className="col-span-6 flex items-center gap-8">
              <div className="h-32 w-48 overflow-hidden rounded-xl bg-gray-200">
                <img
                  src="/src/assets/SubsCheckout.png"
                  alt="Box"
                  className="h-full w-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/200x150?text=Subscription+Box")
                  }
                />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase leading-tight text-green-900">
                  Subscription <br /> Box
                </h3>
                <p className="mt-1 text-lg text-gray-600">
                  Loại: {subscription?.name}
                </p>
              </div>
            </div>
            <div className="col-span-3 text-center text-2xl font-semibold text-gray-700">
              {subscription?.price?.toLocaleString()}đ
            </div>
            <div className="col-span-3 text-right text-2xl font-bold text-black">
              {subscription?.price?.toLocaleString()}đ
            </div>
          </div>
        </div>

        {/* GHI CHÚ & VOUCHER */}
        <div className="mt-12 grid grid-cols-1 gap-8">
          <div className="flex items-center gap-6">
            <label className="w-64 text-2xl font-bold text-green-900">
              Lời nhắn cho shop:
            </label>
            <input
              type="text"
              className="flex-1 rounded-2xl border-2 border-green-700 bg-transparent px-6 py-4 text-xl outline-none transition-all focus:bg-white"
              placeholder="Lưu ý về thời gian giao hàng hoặc đóng gói..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="w-64 text-2xl font-bold text-green-900">
              Mã giảm giá:
            </label>
            <div className="flex flex-1 items-center gap-4">
              <div className="relative max-w-md flex-1">
                <Tag
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700"
                  size={20}
                />
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-green-700 bg-transparent py-4 pl-12 pr-6 text-xl outline-none"
                  placeholder="Nhập mã voucher"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
              </div>
              <button className="text-xl font-bold text-green-700 underline hover:no-underline">
                Chọn mã
              </button>
            </div>
          </div>
        </div>

        {/* TỔNG KẾT & ĐẶT HÀNG */}
        <div className="mt-16 flex flex-col items-end border-t-2 border-dashed border-gray-300 pt-10">
          <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-lg">
            <h3 className="mb-6 flex items-center gap-3 text-3xl font-black text-green-900">
              <ShoppingBasket /> Chi tiết hóa đơn
            </h3>
            <div className="space-y-4 text-xl">
              <div className="flex justify-between text-gray-600">
                <span>Tiền hàng</span>
                <span>{subscription?.price?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-sm font-bold uppercase text-green-600">
                  Miễn phí
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-3xl font-black text-black">
                <span>Tổng tiền</span>
                <span className="text-green-700">
                  {subscription?.price?.toLocaleString()}đ
                </span>
              </div>
            </div>
            <button
              className="mt-10 w-full rounded-2xl bg-[#98E9B1] py-5 text-2xl font-black uppercase tracking-wider text-[#1B3016] shadow-md transition-all hover:bg-[#7ed89b] active:scale-[0.98]"
              onClick={() => alert("Chức năng đặt hàng đang được xử lý!")}
            >
              Xác nhận Đặt hàng
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionCheckout;
