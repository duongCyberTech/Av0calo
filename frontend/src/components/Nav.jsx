import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ShoppingCart } from "lucide-react";
import { isAuthenticated, logout } from "../services/userService";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    setUserLoggedIn(isAuthenticated());
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    navigate('/');
    setIsOpen(false); // Close mobile menu if open
  };

  // Hàm tạo style cho Link active
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-black font-bold border-b-2 border-black pb-1 mx-3 text-xl"
      : "text-black hover:text-gray-700 transition mx-3 text-xl";

  return (
    <>
      <nav className="flex w-full md:w-auto items-center">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-center">
          <NavLink to="/" className={navLinkStyle}>Trang chủ</NavLink>
          <NavLink to="/product" className={navLinkStyle}>Sản phẩm</NavLink>
          <NavLink to="/subscription" className={navLinkStyle}>Gói đăng ký</NavLink>

          {userLoggedIn ? (
            // User đã đăng nhập
            <div className="flex items-center ml-4 space-x-2">
              <NavLink
                to="/cart"
                className="flex items-center text-black hover:text-gray-700 px-3 py-2 rounded-lg transition text-xl"
              >
                <ShoppingCart size={18} className="mr-1" />
                Giỏ hàng
              </NavLink>
              <NavLink
                to="/profile"
                className="flex items-center text-black hover:text-gray-700 px-3 py-2 rounded-lg transition text-xl"
              >
                <User size={18} className="mr-1" />
                Hồ sơ
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 px-3 py-2 rounded-lg transition text-xl"
              >
                <LogOut size={18} className="mr-1" />
                Đăng xuất
              </button>
            </div>
          ) : (
            // Guest user
            <div className="flex items-center ml-4 space-x-2">
              <NavLink to="/login" className="text-black hover:text-gray-700 px-3 py-2 rounded-lg transition text-xl">
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition text-xl">
                Đăng ký
              </NavLink>
            </div>
          )}
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
          <NavLink to="/" onClick={toggleNavbar} className="text-[#2E4A26] font-bold text-lg">Trang chủ</NavLink>
          <NavLink to="/product" onClick={toggleNavbar} className="text-[#2E4A26] font-bold text-lg">Sản phẩm</NavLink>
          <NavLink to="/subscription" onClick={toggleNavbar} className="text-[#2E4A26] font-bold text-lg">Gói đăng ký</NavLink>

          {userLoggedIn ? (
            // User đã đăng nhập
            <>
              <NavLink
                to="/cart"
                onClick={toggleNavbar}
                className="flex items-center text-[#2E4A26] font-bold text-lg"
              >
                <ShoppingCart size={18} className="mr-2" />
                Giỏ hàng
              </NavLink>
              <NavLink
                to="/profile"
                onClick={toggleNavbar}
                className="flex items-center text-[#2E4A26] font-bold text-lg"
              >
                <User size={18} className="mr-2" />
                Hồ sơ cá nhân
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 font-bold text-lg"
              >
                <LogOut size={18} className="mr-2" />
                Đăng xuất
              </button>
            </>
          ) : (
            // Guest user
            <>
              <NavLink to="/login" onClick={toggleNavbar} className="text-[#2E4A26] font-bold text-lg">
                Đăng nhập
              </NavLink>
              <NavLink to="/register" onClick={toggleNavbar} className="bg-[#2E4A26] text-white px-6 py-2 rounded-full text-lg">
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Nav;