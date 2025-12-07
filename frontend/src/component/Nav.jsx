import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Hàm tạo style cho Link active
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-[#2E4A26] font-bold border-b-2 border-[#2E4A26] pb-1 mx-2"
      : "text-gray-600 hover:text-[#74D978] transition mx-2";

  return (
    <>
      <nav className="flex w-full md:w-auto items-center">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-center">
          <NavLink to="/" className={navLinkStyle}>Trang chủ</NavLink>
          <NavLink to="/product" className={navLinkStyle}>Sản phẩm</NavLink>
          <NavLink to="/subscription" className={navLinkStyle}>Gói đăng ký</NavLink>
          {/* Nút đăng ký/đăng nhập nếu cần */}
          <NavLink to="/signup" className="ml-4 bg-[#2E4A26] text-white px-4 py-2 rounded-full hover:bg-black transition">
             Đăng ký
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button onClick={toggleNavbar}>
            {isOpen ? <X color="#2E4A26" /> : <Menu color="#2E4A26" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-[#F9FBF7] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden z-40">
          <NavLink to="/" onClick={toggleNavbar} className="text-[#2E4A26] font-bold">Trang chủ</NavLink>
          <NavLink to="/product" onClick={toggleNavbar} className="text-[#2E4A26] font-bold">Sản phẩm</NavLink>
          <NavLink to="/subscription" onClick={toggleNavbar} className="text-[#2E4A26] font-bold">Gói đăng ký</NavLink>
           <NavLink to="/signup" onClick={toggleNavbar} className="bg-[#2E4A26] text-white px-6 py-2 rounded-full">Đăng ký</NavLink>
        </div>
      )}
    </>
  );
};

export default Nav;
