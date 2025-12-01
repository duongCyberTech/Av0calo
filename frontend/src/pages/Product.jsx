import React from 'react';
import Header from '../components/Header'; // Tận dụng Header đã có

const Product = () => {
  return (
    <div className="bg-[#F9FBF7] min-h-screen">
      <Header />
      <div className="pt-24 text-center">
        <h1 className="text-3xl font-bold text-[#2E4A26]">Danh Sách Sản Phẩm</h1>
        <p className="mt-4">Nội dung trang sản phẩm sẽ hiển thị ở đây...</p>
      </div>
    </div>
  );
};

// --- QUAN TRỌNG NHẤT: Phải có dòng này ở cuối ---
export default Product;
