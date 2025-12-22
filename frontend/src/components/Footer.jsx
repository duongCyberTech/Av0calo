import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-[#3D5B2E] text-white py-8 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={logo}
                        alt="Avocalo"
                        className="h-24 md:h-28"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-[18px] font-semibold mb-2">Liên kết nhanh</h3>
                            <div className="text-[16px] font-light">
                                <Link to="/" className="hover:underline">Trang chủ</Link>
                                <span className="mx-1">/</span>
                                <Link to="/product" className="hover:underline">Sản phẩm</Link>
                                <span className="mx-1">/</span>
                                <Link to="/subscription" className="hover:underline">Gói đăng ký</Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[18px] font-semibold mb-2">Hotline</h3>
                            <p className="text-[16px] font-light">012345678910</p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-[18px] font-semibold mb-2">Địa chỉ</h3>
                            <p className="text-[16px] font-light">Tòa nhà H6, HCMUT</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 items-center">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram text-2xl"></i>
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook text-2xl"></i>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter text-2xl"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;