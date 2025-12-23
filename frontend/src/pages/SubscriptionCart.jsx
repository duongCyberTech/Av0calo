import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSubscriptionById } from "../services/subscriptionService";
import { isAuthenticated } from "../services/userService";

const SubscriptionCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscription, setSubscription] = useState(
    location.state?.subscription,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  // Nếu có sub_id, gọi API để lấy thông tin chi tiết
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!subscription?.sub_id) return;

      // Kiểm tra đăng nhập
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const details = await getSubscriptionById(subscription.sub_id);
        setSubscriptionDetails(details);

        // Cập nhật subscription với thông tin từ API nếu cần
        if (details) {
          setSubscription((prev) => ({
            ...prev,
            title: details.title,
            description: details.description,
            products: details.products,
            promotions: details.promotions,
          }));
        }
      } catch (err) {
        console.error("Error fetching subscription details:", err);
        setError(
          err.body?.message || "Không thể tải thông tin chi tiết gói đăng ký",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [subscription?.sub_id, navigate]);

  if (!subscription) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F1F8E9]">
        <h2 className="text-2xl font-bold text-[#2E4A26]">Giỏ hàng trống</h2>
        <button
          onClick={() => navigate("/subscription")}
          className="mt-4 rounded-lg bg-[#98E9B1] px-6 py-2 font-bold text-[#2E4A26]"
        >
          Quay lại chọn gói
        </button>
      </div>
    );
  }

  if (loading && !subscriptionDetails) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F1F8E9]">
        <div className="text-[32px] text-[#266a29]">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F8E9] font-sans text-[#2E4A26]">
      <Header />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        {/* Breadcrumb */}
        <nav className="mb-6 text-[20px] text-gray-600">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          {" / "}
          <span className="font-semibold text-black underline underline-offset-4">
            Giỏ hàng
          </span>
        </nav>

        {/* Title */}
        <h1 className="mb-10 text-[56px] font-bold">Giỏ hàng</h1>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-[24px] text-red-600">
            {error}
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-12 items-center rounded-lg bg-[#98E9B1] px-8 py-4 text-center text-[28px] font-semibold">
          <div className="col-span-5 text-left">Sản phẩm</div>
          <div className="col-span-3">Loại</div>
          <div className="col-span-4">Số tiền</div>
        </div>

        {/* Product Row */}
        <div className="mt-2 border-b-2 border-gray-300 pb-10">
          <div className="grid grid-cols-12 items-center px-8 py-8">
            {/* Hình ảnh và Tên sản phẩm */}
            <div className="col-span-5 flex items-center gap-10">
              <img
                src="/src/assets/SubsCheckout.png"
                alt="Product"
                className="h-32 w-48 rounded-md object-cover shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-[36px] font-bold leading-tight">
                  Subscription Box
                </span>
                {subscription.description && (
                  <span className="mt-2 text-[20px] font-light text-gray-600">
                    {subscription.description}
                  </span>
                )}
              </div>
            </div>

            {/* Loại gói */}
            <div className="col-span-3 text-center text-[26px]">
              {subscription.name || subscription.title}
            </div>

            {/* Số tiền và Checkbox */}
            <div className="col-span-4 flex items-center justify-end gap-16">
              <span className="text-[26px] font-medium">
                {subscription.price.toLocaleString("vi-VN")} VNĐ
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="h-6 w-6 accent-[#2E4A26]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-end gap-10 md:flex-row md:justify-between">
          {/* Chọn tất cả */}
          <div className="flex items-center gap-4 text-[26px]">
            <input type="checkbox" className="h-6 w-6 accent-[#2E4A26]" />
            <span>Chọn tất cả</span>
          </div>

          {/* Chi tiết thanh toán */}
          <div className="w-full max-w-lg">
            <h3 className="mb-6 text-[32px] font-bold">Chi tiết thanh toán</h3>
            <div className="space-y-4 text-[24px]">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>{subscription.price.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Đã giảm</span>
                <span>-0 VNĐ</span>
              </div>
              <div className="flex justify-between border-b-2 border-[#2E4A26]/20 pb-4">
                <span>Phí giao hàng</span>
                <span>0 VNĐ</span>
              </div>
              <div className="flex justify-between pt-2 text-[28px] font-bold">
                <span>Tổng thanh toán</span>
                <span>{subscription.price.toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>

            {/* Nút đặt hàng */}
            <button
              onClick={() => {
                try {
                  sessionStorage.setItem(
                    "subscription_checkout",
                    JSON.stringify(subscription),
                  );
                } catch (e) {
                  console.warn(
                    "Unable to persist subscription to sessionStorage",
                    e,
                  );
                }
                navigate("/subscription-checkout", { state: { subscription } });
              }}
              className="mt-10 w-full rounded-2xl bg-[#98E9B1] py-4 text-[28px] font-bold tracking-widest text-[#2E4A26] shadow-md transition hover:bg-[#85da9f]"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionCart;
