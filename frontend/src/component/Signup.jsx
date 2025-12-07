import React, { useState } from 'react';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    interest: 'lose-weight',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/otp-signup', { state: { email: formData.email } });

  };

  return (
    <div className="bg-[#91EAAF] text-gray-700 min-h-screen flex flex-col">
      <Nav />

      <div className="flex-grow flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8 relative">

        <div className="flex-center w-[704px] h-auto space-y-2 items-center bg-white p-8 rounded-2xl relative z-10 border border-black">
          <div className="text-center">
            <h2 className="mt-2 text-[48px] text-black">
              ĐĂNG KÝ
            </h2>
          </div>

          <div className="relative flex items-center px-3">
            <div className="flex-grow border-t border-black"></div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 rounded-md shadow-sm px-3 -space-y-px text-[20px]">
              {/* Full Name */}
              <div>
                <div className='flex justify-between items-center gap-2 px-5'>
                  <label htmlFor="fullName" className="block font-extralight text-black mb-1">Tên người dùng (*)</label>
                  <i class="fa-solid fa-user"></i>
                </div>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className='flex justify-between items-center gap-2 px-5'>
                  <label htmlFor="email" className="block font-extralight text-black mb-1">Email (*)</label>
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                    placeholder="Bachkhoatuiiu@hcmut.edu.vn"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className='flex justify-between items-center gap-2 px-5'>
                  <label htmlFor="password" className="block font-extralight text-black mb-1">Mật khẩu (*)</label>
                  <i className="fas fa-lock text-black text-gray-600"></i>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className='flex justify-between items-center gap-2 px-5'>
                  <label htmlFor="phone" className="block font-extralight text-black mb-1">SĐT (*)</label>
                  <i class="fa-solid fa-phone-flip text-gray-600"></i>
                </div>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="bg-[#F1F8E9] appearance-none rounded-xl relative block w-full px-3 py-3 pl-5 font-extralight placeholder-[#9E9E9E] text-black focus:outline-none focus:ring-[#A8D08D] focus:border-[#A8D08D] focus:z-10 transition-colors"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center px-3">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#2E4A26] focus:ring-[#A8D08D] border-gray-300 rounded cursor-pointer"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-gray-900">
                Tôi đồng ý với <a href="/policy" className="font-medium text-[#2E4A26] hover:text-[#6E8B3D] underline">Điều khoản & Chính sách</a> của Av0calo.
              </label>
            </div>

            <div className='px-3'>
              <button
                type="submit"
                className="bg-[#91EAAF] text-[#237928] text-[32px] font-bold group relative w-full  item-center justify-center py-3 px-4 rounded-[15px] hover:bg-[#4CAF50] focus:outline-none transition-all transform hover:-translate-y-1"
              >
                ĐĂNG KÝ
              </button>
            </div>

            <div className='px-3'>
              <button
                type="submit"
                className="bg-[#E2F5E3] text-[#000000] group relative w-full flex justify-center py-3 px-4 rounded-[15px] hover:bg-[#C9DFDF] focus:outline-none transition-all transform hover:-translate-y-1"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="fab fa-google text-red-500 mr-2"></i>
                </span>
                Đăng ký với Google
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-600 py-">
              Bạn đã có tài khoản?{' '}
              <a href="/login" className="text-[#2E4A26] hover:text-[#6E8B3D]">
                Đăng nhập
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SignUp;
