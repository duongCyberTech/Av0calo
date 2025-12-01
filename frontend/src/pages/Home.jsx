import React from "react";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";
// import Footer from "../components/Footer";

const Home = () => {
  // Dữ liệu sản phẩm giả lập
  const products = [
    {
      id: 1,
      name: "Dầu bơ",
      rating: 5,
      reviews: 1005,
      price: 550000,
      img: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=300",
    },
    {
      id: 2,
      name: "Mặt nạ",
      rating: 5,
      reviews: 2000,
      price: 150000,
      img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300",
    },
    {
      id: 3,
      name: "Bơ sấy",
      rating: 4.5,
      reviews: 500,
      price: 90000,
      img: "https://images.unsplash.com/photo-1615485925763-867862f80a90?w=300",
    },
    {
      id: 4,
      name: "Bột bơ",
      rating: 5,
      reviews: 1205,
      price: 250000,
      img: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=300",
    },
    {
      id: 5,
      name: "Sốt bơ",
      rating: 5,
      reviews: 3020,
      price: 120000,
      img: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300",
    },
  ];

  return (
    <div className="bg-[#F9FBF7] min-h-screen font-['Quicksand'] pt-[80px]">
      <Header />

      {/* --- HERO SECTION --- */}
      <header className="relative py-16 overflow-hidden">
        {/* Vòng tròn trang trí nền */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B5E4B9] rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/4"></div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-[#38491E] mb-2 font-['Nunito']">
              Av<span className="text-[#F2C94C]">0</span>Calo
            </h1>
            <h2 className="text-3xl font-bold text-[#38491E] mb-6 leading-tight">
              Nguồn năng lượng xanh cho <br /> ngày mới nhẹ nhàng
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Từ quả bơ nguyên chất, chúng tôi tạo nên những sản phẩm lành mạnh,
              giúp bạn sống cân bằng và yêu cơ thể mỗi ngày.
            </p>
            <button className="bg-[#74D978] hover:bg-[#5fc063] text-[#1E4D2B] font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1">
              Danh mục sản phẩm
            </button>
          </div>
          {/* Ảnh Hero */}
          <div className="relative flex justify-center">
            <div className="w-80 h-80 rounded-full border-[8px] border-[#74D978] overflow-hidden shadow-2xl relative z-10 bg-white">
              <img
                src="https://images.unsplash.com/photo-1523049673856-356c64cf4c94?w=600"
                alt="Avocado"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Vòng tròn trang trí sau ảnh */}
            <div className="absolute bg-[#2E7D32] w-80 h-80 rounded-full -z-10 top-4 -right-4"></div>
          </div>
        </div>
      </header>

      {/* --- PRODUCT LIST --- */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h3 className="text-xl font-bold text-[#38491E] mb-16 text-center md:text-left pl-4 border-l-4 border-[#74D978]">
          Sản phẩm từ bơ - Dinh dưỡng xanh, năng lượng sạch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 gap-y-16">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-lg p-4 pt-16 relative text-center group hover:-translate-y-2 transition duration-300"
            >
              {/* Ảnh nổi */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full p-1 bg-white shadow-md">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h4 className="font-bold text-[#38491E] text-lg mb-1">
                {p.name}
              </h4>
              <div className="flex justify-center text-yellow-400 text-xs mb-3">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${i < Math.floor(p.rating) ? "" : "text-gray-300"}`}
                  ></i>
                ))}
                <span className="text-gray-400 ml-1">({p.reviews})</span>
              </div>
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="font-bold text-[#38491E]">
                  {p.price.toLocaleString()}đ
                </span>
                <button className="bg-[#91EAAF] text-[#1E4D2B] text-xs font-bold px-3 py-1 rounded-full hover:bg-green-400">
                  Mua ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-[#C4EBC8] rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden">
          <div className="flex-1 z-10">
            <h2 className="text-3xl font-bold text-[#38491E] mb-6">
              Giới thiệu về Av0Calo
            </h2>
            <ul className="space-y-3 text-[#2E4A26]">
              <li>
                <strong>"Avocado"</strong> - quả bơ, nguyên liệu chủ đạo giàu dinh dưỡng.
              </li>
              <li>
                <strong>"0 / Zero"</strong> - biểu trưng cho tinh thần Eat Clean, nói “không” với đường tinh luyện, chất bảo quản và calo dư thừa.
              </li>
              <li>
                <strong>"Calorie"</strong> - gợi liên tưởng đến năng lượng tích cực, khỏe mạnh, và lối sống lành mạnh.
              </li>
              <li>
                Tên gọi vừa hiện đại, vừa dễ nhớ, thể hiện rõ định vị thương hiệu thực phẩm xanh – sạch – năng lượng tích cực, giúp mỗi người hướng đến cơ thể khỏe mạnh và tâm trí an yên.
              </li>
            </ul>
            <button className="mt-6 bg-[#2E4A26] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-black transition">
              Tìm hiểu thêm
            </button>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1601039641847-7857b994d704?w=600"
              className="rounded-3xl shadow-lg transform rotate-2 hover:rotate-0 transition duration-500"
              alt="Intro"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
