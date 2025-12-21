import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function CommentAnalysis(){

  const [dataComments, setComments] = useState([])
  const [aspects, setAspects] = useState([])

  return (
    <div className="bg-[#F9FBF7] min-h-screen">
      <Header />
      <div className="pt-24 text-center">
        <h1 className="text-3xl font-bold text-[#2E4A26]">Phân tích phản hồi người dùng</h1>
        <p className="mt-4">Nội dung trang sản phẩm sẽ hiển thị ở đây...</p>
      </div>
    </div>
  );
}