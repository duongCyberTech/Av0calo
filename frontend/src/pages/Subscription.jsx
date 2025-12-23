import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllSubscriptions } from "../services/subscriptionService";

const Subscription = () => {
  const navigate = useNavigate();
  const processRef = useRef(null);
  const packageRef = useRef(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllSubscriptions();
        setSubscriptions(data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setError(err.body?.message || "Không thể tải danh sách gói đăng ký");
        // Nếu lỗi do chưa đăng nhập, vẫn hiển thị trang nhưng không có packages
        if (err.status === 401) {
          setError("Vui lòng đăng nhập để xem các gói đăng ký");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubscribe = (subscription) => {
    navigate("/subscription-cart", {
      state: {
        subscription: {
          id: subscription.sub_id,
          sub_id: subscription.sub_id,
          name: subscription.title,
          price: subscription.price,
          billing_cycle: subscription.duration,
          description: subscription.description,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9] font-sans text-[#266a29]">
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative mb-10 min-h-[400px] bg-[url('/src/assets/Subscription1.jpg')] bg-cover bg-center px-10 py-16 text-white">
        <h1 className="mb-6 text-[60px] font-semibold italic text-[#ACF4C5]">
          Subscription Box
        </h1>
        <p className="text-[48px] font-light text-[#D8FFCB]">
          Eat Clean dễ dàng mỗi tháng –
        </p>
        <p className="text-[48px] font-light text-[#D8FFCB]">
          cùng Av0calo Subscription Box.
        </p>
      </section>

      {/* ================= INTRO ================= */}
      <section className="mb-10 px-6 py-12 text-center">
        <h2 className="mb-2 text-[64px]">Eat Clean dễ dàng cùng Av0calo</h2>

        <p className="mx-auto mb-6 text-[40px] font-light">
          Tiết kiệm chi phí và thời gian đi chợ.
        </p>
        <p className="mx-auto mb-6 text-[40px] font-light">
          Nhận định kỳ các sản phẩm bơ tươi ngon & chế biến lành mạnh từ nông
          trại Tây Nguyên.
        </p>

        <div className="flex justify-center gap-6">
          {/* CHỌN GÓI NGAY */}
          <button
            onClick={() =>
              packageRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="rounded-[30px] bg-[#237928]/65 px-8 py-4 text-[48px] text-white transition hover:-translate-y-1 hover:bg-[#237928]"
          >
            Chọn Gói Ngay
          </button>

          {/* TÌM HIỂU THÊM */}
          <button
            onClick={() =>
              processRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="rounded-[30px] border-2 border-[#237928]/65 px-8 py-4 text-[48px] text-[#266A29] transition hover:-translate-y-1 hover:border-[#237928]"
          >
            Tìm Hiểu Thêm
          </button>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section
        ref={processRef}
        className="relative mb-10 scroll-mt-32 bg-[url('/src/assets/Subscription2.jpg')] bg-cover bg-center px-6 py-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-white/70"></div>

        <div className="relative z-10 mx-auto mb-10 max-w-[600px] rounded-[30px] border border-black bg-[#B8FFA0] p-6 text-center">
          <div className="text-[36px] font-bold">QUY TRÌNH ĐƠN GIẢN</div>
          <div className="text-[32px]">Đăng ký dễ dàng trong 3 bước</div>
        </div>

        <div className="relative z-10 mx-auto grid w-full grid-cols-1 gap-10 px-10 md:grid-cols-3">
          {[
            { title: "Chọn Gói", desc: "Lựa chọn combo phù hợp", icon: "📦" },
            { title: "Tùy Chỉnh", desc: "Điều chỉnh linh hoạt", icon: "⚙️" },
            { title: "Nhận Box", desc: "Giao tận nhà mỗi tháng", icon: "🚚" },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 text-center shadow"
            >
              <div className="mb-4 text-6xl">{item.icon}</div>
              <h4 className="mb-2 text-[40px]">{item.title}</h4>
              <p className="text-[24px] font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="px-6 py-12 text-[32px]">
        <div className="mx-auto rounded-[30px] bg-[#BCE6C6] p-8">
          <h3 className="mb-6 text-center text-[64px] font-semibold">
            Tại sao chọn AvOcalo Subscription?
          </h3>

          <div className="grid grid-cols-1 items-center gap-6 px-8 md:grid-cols-[auto_1fr]">
            <img
              src="/src/assets/Subscription3.jpg"
              className="mx-auto max-w-[300px] rounded-3xl shadow-lg md:mx-0"
            />

            <ul className="space-y-4 text-left font-light md:pl-8">
              <li>
                <strong className="text-[40px]">Tiết kiệm chi tiêu:</strong> Giá
                ưu đãi hơn mua lẻ.
              </li>
              <li>
                <strong className="text-[40px]">Hỗ trợ nông dân:</strong> Ủng hộ
                nông trại Tây Nguyên.
              </li>
              <li>
                <strong className="text-[40px]">Linh hoạt:</strong> Dễ dàng tạm
                dừng hoặc hủy.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section ref={packageRef} className="scroll-mt-32 px-6 py-12">
        <h3 className="mb-10 text-center text-[48px] font-semibold">
          Chọn Gói Phù Hợp Với Bạn
        </h3>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-[32px] text-[#266a29]">Đang tải...</div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-7xl rounded-3xl bg-red-50 p-8 text-center">
            <p className="text-[32px] text-red-600">{error}</p>
            {error.includes("đăng nhập") && (
              <button
                onClick={() => navigate("/login")}
                className="mt-4 rounded-[30px] bg-[#237928] px-8 py-4 text-[28px] text-white hover:bg-[#1a5d1e]"
              >
                Đăng Nhập
              </button>
            )}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="mx-auto max-w-7xl rounded-3xl bg-yellow-50 p-8 text-center">
            <p className="text-[32px] text-yellow-600">
              Hiện tại chưa có gói đăng ký nào
            </p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-10 md:grid-cols-2">
            {subscriptions.map((subscription) => (
              <div key={subscription.sub_id} className="rounded-3xl bg-white p-8 shadow">
                <h4 className="mb-4 text-[40px] font-bold">{subscription.title}</h4>
                {subscription.description && (
                  <p className="mb-4 text-[28px] font-light text-gray-600">
                    {subscription.description}
                  </p>
                )}
                <p className="mb-2 text-[24px] font-light text-gray-500">
                  Chu kỳ:{" "}
                  {subscription.duration === "yearly"
                    ? "Hàng năm"
                    : subscription.duration === "monthly"
                    ? "Hàng tháng"
                    : subscription.duration === "weekly"
                    ? "Hàng tuần"
                    : subscription.duration}
                </p>
                <p className="mb-6 text-[32px] font-semibold text-[#237928]">
                  {subscription.price.toLocaleString("vi-VN")} VNĐ
                </p>

                <button
                  onClick={() => handleSubscribe(subscription)}
                  className="w-full rounded-[40px] bg-[#237928]/65 py-4 text-[40px] text-white hover:bg-[#237928]"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Subscription;
