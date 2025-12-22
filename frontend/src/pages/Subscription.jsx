import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import placeholderImg from "../assets/product-placeholder.svg";
import { fetchJSON } from "../utils/api";

const Subscription = () => {
  const processRef = useRef(null);
  const packageRef = useRef(null);

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

      {/* ================= PACKAGES ================= */}
      <section ref={packageRef} className="scroll-mt-32 px-6 py-12">
        <h3 className="mb-2 text-center text-[48px] font-semibold">
          Chọn Gói Phù Hợp Với Bạn
        </h3>
        <p className="mb-10 text-center text-[40px] font-light">
          Bắt đầu hành trình sống xanh ngay hôm nay.
        </p>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-10 md:grid-cols-2">
          {/* Cá nhân */}
          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-[40px] font-bold">Gói Cá Nhân</h4>
              <div className="text-right">
                <span className="block text-[64px] font-bold text-red-500">
                  3.999k
                </span>
                <span className="block text-[40px]">/năm</span>
              </div>
            </div>

            <ul className="mb-10 space-y-2 text-[32px] font-light">
              <li>• 4 sản phẩm bơ</li>
              <li>• Tư vấn dinh dưỡng</li>
              <li>• Miễn phí vận chuyển</li>
            </ul>

            <button className="w-full rounded-[40px] bg-[#237928]/65 py-4 text-[40px] text-white transition hover:-translate-y-1 hover:bg-[#237928]">
              Đăng Ký Ngay
            </button>
          </div>

          {/* Gia đình */}
          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-[40px] font-bold">Gói Gia Đình</h4>
              <div className="text-right">
                <span className="block text-[64px] font-bold text-red-500">
                  6.999k
                </span>
                <span className="block text-[40px]">/năm</span>
              </div>
            </div>

            <ul className="mb-10 space-y-2 text-[32px] font-light">
              <li>• 6 sản phẩm bơ</li>
              <li>• Hỗ trợ ưu tiên</li>
              <li>• Miễn phí vận chuyển</li>
            </ul>

            <button className="w-full rounded-[40px] bg-[#237928]/65 py-4 text-[40px] text-white hover:bg-[#237928]">
              Đăng Ký Ngay
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subscription;