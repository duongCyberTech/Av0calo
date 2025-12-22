import { useState } from "react"; // Đã thêm import này
import Nav from "./Nav";
import logo from "../assets/logo.png"; // Đảm bảo bạn có file này, nếu chưa có thì comment lại

const Header = () => {
  // const [isOpen, setIsOpen] = useState(false); // Biến này không dùng ở đây, có thể bỏ

  return (
    <header className="bg-[#74D978] backdrop-blur-md sticky top-0 z-50 w-full shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-0 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-1 cursor-pointer -ml-1">
          <a href="/" className="flex items-center gap-2">
            {/* Nếu chưa có ảnh logo, dùng text tạm */}
            <img src={logo} alt="Av0calo Logo" className="h-48 w-48 object-contain -my-12" />
          </a>
        </div>

        {/* Navigation Section */}
        <Nav />
      </div>
    </header>
  );
};

export default Header;