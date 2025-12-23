import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import placeholderImg from "../assets/product-placeholder.svg";
import { fetchJSON } from "../utils/api";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchJSON("/products/all", { method: "GET" });
        const productList = Array.isArray(response)
          ? response
          : response.result || [];

        // Transform data to match frontend structure
        const transformedProducts = productList.map((p) => ({
          pid: p.pid,
          name: p.title,
          price: p.sell_price || p.price || 0,
          rating: p.rating || 0,
          reviews: p.sold ? `${p.sold}+` : "0",
          thumbnail: p.thumbnail || null,
          images: p.thumbnail ? [p.thumbnail] : [],
          categoryId: p.cate_id,
          categoryName: p.cate_name,
          stock: p.stock
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý cuộn trang mượt mà
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F1F8E9] font-['Josefin_Sans']">
      <Header />

      {/* --- HERO SECTION (Đã chỉnh lề rộng) --- */}
      <header className="relative overflow-hidden py-24">
        <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/2 rounded-full bg-[#B5E4B9] opacity-50 blur-3xl"></div>

        <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-10 md:grid-cols-2">
          <div>
            <h1 className="mb-2 text-[64px] font-bold italic leading-none text-black">
              Av0Calo
            </h1>
            <h2 className="mb-8 text-[42px] font-semibold leading-tight text-[#266A29]">
              Nguồn năng lượng xanh cho ngày mới nhẹ nhàng
            </h2>
            <p className="mb-10 max-w-xl text-[22px] leading-relaxed text-gray-800">
              Từ quả bơ nguyên chất, chúng tôi tạo nên những sản phẩm lành mạnh,
              giúp bạn sống cân bằng và yêu cơ thể mỗi ngày.
            </p>
            <button className="rounded-[20px] bg-[#91EAAF] px-12 py-4 text-[26px] font-bold text-black shadow-xl transition-all hover:-translate-y-1 hover:bg-[#4CAF50] focus:outline-none">
              Danh mục sản phẩm
            </button>
          </div>

          <div className="relative flex justify-center">
            <div className="relative z-10 h-[450px] w-[450px] overflow-hidden rounded-full border-[12px] border-[#74D978] bg-white shadow-2xl">
              <img
                src="/src/assets/home1.png"
                alt="Avocado"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -right-8 top-8 -z-10 h-[450px] w-[450px] rounded-full bg-[#2E7D32]"></div>
          </div>
        </div>
      </header>

      {/* --- PRODUCTS SECTION --- */}
      <section className="mx-auto max-w-[1440px] px-10 py-20">
        <h2 className="mb-16 text-4xl font-bold text-[#266A29]">
          Sản phẩm từ bơ - Dinh dưỡng xanh, năng lượng sạch
        </h2>
        <div className="grid grid-cols-2 gap-16 gap-y-24 pt-8 md:grid-cols-3 md:gap-20 md:gap-y-28 lg:grid-cols-5 lg:gap-24">
          {loading ? (
            <div className="col-span-full text-center text-lg text-gray-600">
              Đang tải sản phẩm...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-lg text-gray-600">
              Chưa có sản phẩm nào
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p.pid}
                className="relative mx-auto mt-28 w-60 cursor-pointer overflow-visible rounded-3xl px-6 pb-6 pt-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  boxShadow:
                    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                }}
                onClick={() => navigate(`/product/${p.pid}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/product/${p.pid}`);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Xem chi tiết ${p.name}`}
              >
                <div className="-mt-28 mb-4 flex justify-center">
                  <Link
                    to={`/product/${p.pid}`}
                    className="h-44 w-44 overflow-hidden rounded-full p-2.5 shadow-md"
                    style={{ backgroundColor: "rgba(46,125,50,0.81)" }}
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#F9FBF7]">
                      <img
                        src={p.thumbnail || p.images?.[0] || placeholderImg}
                        alt={p.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = placeholderImg;
                        }}
                      />
                    </div>
                  </Link>
                </div>
                <h4 className="mb-2 text-center text-lg font-semibold text-[#237928]">
                  {p.name}
                </h4>
                {/* Rating row to match listing cards */}
                <div className="mb-3 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star text-base ${i < Math.floor(p.rating || 0) ? "text-[#FFB800]" : "text-gray-300"}`}
                    ></i>
                  ))}
                  <span className="ml-1 text-xs font-medium text-gray-600">
                    ({p.reviews || "0"})
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="rounded-full px-4 py-2 text-sm font-semibold text-[#3D5B2E] shadow-[inset_0_0_0_2px_#4A9F67]">
                    {(p.price || 0).toLocaleString("vi-VN")}
                  </span>
                  <Link
                    to={`/product/${p.pid}`}
                    className="whitespace-nowrap rounded-full bg-[#91EAAF] px-5 py-2 text-sm font-semibold text-black shadow-md transition-colors hover:bg-[#4CAF50] hover:shadow-lg"
                  >
                    Mua ngay
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- INTRO SECTION --- */}
      <section className="px-10 pb-24">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-16 rounded-[60px] bg-[#D1EBD8] p-16 md:flex-row">
          <div className="md:w-3/5">
            <h3 className="mb-10 text-5xl font-bold text-[#266A29]">
              Giới thiệu về AvOcalo
            </h3>
            <div className="space-y-6 text-[20px] leading-relaxed">
              <p>
                <strong>"Avocado"</strong> - quả bơ, nguyên liệu chủ đạo giàu
                dinh dưỡng.
              </p>
              <p>
                <strong>"0 / Zero"</strong> - tinh thần Eat Clean, nói "không"
                với đường tinh luyện và chất bảo quản.
              </p>
              <p>
                <strong>"Calorie"</strong> - năng lượng tích cực, khỏe mạnh, và
                lối sống lành mạnh.
              </p>
            </div>
            {/* Nút Tìm hiểu thêm số 1 */}
            <button
              onClick={scrollToContact}
              className="mt-12 rounded-full bg-[#5FA563] px-12 py-4 text-[24px] font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#237928]"
            >
              Tìm hiểu thêm
            </button>
          </div>
          <div className="md:w-2/5">
            <img
              src="/src/assets/Subscription3.jpg"
              className="h-[450px] w-full rounded-[40px] object-cover shadow-2xl"
              alt="Intro"
            />
          </div>
        </div>
      </section>

      {/* --- SUBSCRIPTION SECTION --- */}
      <section className="mx-auto mb-20 flex max-w-[1600px] flex-col items-stretch gap-10 px-10 md:flex-row">
        <div className="hidden w-1/4 overflow-hidden rounded-[40px] border-4 border-[#2D5A27] md:block">
          <img
            src="/src/assets/home3.jpg"
            className="h-full w-full object-cover"
            alt="Sub 1"
          />
        </div>
        <div className="flex flex-col justify-center rounded-[50px] bg-[#9CE1A0] p-16 text-center md:w-2/4">
          <h3 className="mb-8 font-serif text-[64px] font-bold italic text-[#266A29]">
            Subscription Box
          </h3>
          <p className="mb-8 text-[22px] leading-relaxed text-[#1B4D1D]">
            Trải nghiệm lối sống lành mạnh với gói giao định kỳ 3–4 sản phẩm bơ
            tuyển chọn, tiện lợi và giàu dinh dưỡng hằng ngày.
          </p>
          {/* Nút Tìm hiểu thêm số 2 */}
          <button
            onClick={scrollToContact}
            className="mx-auto w-fit rounded-full bg-[#237928] px-14 py-4 text-[26px] font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-black"
          >
            Tìm hiểu thêm
          </button>
        </div>
        <div className="hidden w-1/4 overflow-hidden rounded-[40px] border-4 border-[#2D5A27] md:block">
          <img
            src="/src/assets/home4.jpg"
            className="h-full w-full object-cover"
            alt="Sub 2"
          />
        </div>
      </section>

      {/* --- CONTACT FORM (Thêm ID để scroll tới) --- */}
      <section id="contact-form" className="scroll-mt-20 px-10 py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-24 rounded-[80px] bg-[#91EAAF]/45 p-20 md:flex-row">
          <div className="flex justify-center md:w-1/3">
            <img
              src="/src/assets/home5.png"
              alt="Heart Avocado"
              className="w-[350px] animate-pulse"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="mb-12 text-6xl font-bold text-[#266A29]">
              Liên hệ với chúng tôi
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="rounded-full border border-green-800 bg-white/50 px-8 py-4 text-xl ring-green-500 focus:outline-none focus:ring-2"
                />
                <input
                  type="text"
                  placeholder="SĐT"
                  className="rounded-full border border-green-800 bg-white/50 px-8 py-4 text-xl focus:outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-full border border-green-800 bg-white/50 px-8 py-4 text-xl focus:outline-none"
              />
              <textarea
                placeholder="Lời nhắn..."
                className="h-48 w-full rounded-[40px] border border-green-800 bg-[#74D978] px-8 py-6 text-xl placeholder-green-900 focus:outline-none"
              ></textarea>
              <button className="w-full rounded-full bg-[#266A29] py-5 text-2xl font-bold text-white shadow-2xl transition-all hover:bg-black">
                GỬI THÔNG TIN
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
