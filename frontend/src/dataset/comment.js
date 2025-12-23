// src/dataset/mockComments.js

export const mockComments = [
  // --- NHÓM DẦU BƠ (AVOCADO OIL) ---
  {
    id: 1,
    userName: "Nguyễn Thu Hà",
    avatar: "https://i.pravatar.cc/150?u=1",
    productName: "Dầu Bơ Ép Lạnh Nguyên Chất 250ml",
    category: "Dầu ăn kiêng",
    rating: 5,
    date: "2023-10-15",
    content: "Mình dùng dầu này trộn salad thay cho dầu oliu thấy thơm nhẹ, không bị hắc. Rất hợp với chế độ Eatclean, sẽ mua lại.",
    sentiment: "positive"
  },
  {
    id: 2,
    userName: "Trần Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?u=2",
    productName: "Dầu Bơ Spray (Dạng xịt)",
    category: "Dầu ăn kiêng",
    rating: 4,
    date: "2023-10-18",
    content: "Dạng xịt tiện lợi, kiểm soát được lượng dầu khi áp chảo. Tuy nhiên vòi xịt hơi mạnh tay, cần cải thiện đầu phun sương mịn hơn.",
    sentiment: "neutral"
  },
  {
    id: 3,
    userName: "Lê Văn Hùng",
    avatar: "https://i.pravatar.cc/150?u=3",
    productName: "Dầu Bơ Hữu Cơ Organic",
    category: "Dầu ăn kiêng",
    rating: 2,
    date: "2023-10-20",
    content: "Giá hơi cao so với dung tích. Đóng gói không kỹ nên lúc nhận hàng bị rỉ dầu ra ngoài hộp.",
    sentiment: "negative"
  },

  // --- NHÓM SNACK BƠ (AVOCADO CHIPS) ---
  {
    id: 4,
    userName: "Phạm Thanh Hằng",
    avatar: "https://i.pravatar.cc/150?u=4",
    productName: "Snack Bơ Nướng Vị Phô Mai",
    category: "Đồ ăn vặt",
    rating: 5,
    date: "2023-11-01",
    content: "Snack giòn rụm, vị béo của bơ kết hợp phô mai ăn cuốn thực sự. Điểm cộng là không bị gắt dầu như snack khoai tây thường.",
    sentiment: "positive"
  },
  {
    id: 5,
    userName: "Hoàng Đức",
    avatar: "https://i.pravatar.cc/150?u=5",
    productName: "Snack Bơ Vị Muối Biển",
    category: "Đồ ăn vặt",
    rating: 3,
    date: "2023-11-05",
    content: "Vị hơi nhạt so với khẩu vị của mình. Ai ăn nhạt (low sodium) thì chắc sẽ thích, mình phải chấm thêm tương ớt.",
    sentiment: "neutral"
  },

  // --- NHÓM BƠ SẤY (DRIED AVOCADO) ---
  {
    id: 6,
    userName: "Vũ Thị Mai",
    avatar: "https://i.pravatar.cc/150?u=6",
    productName: "Bơ Sấy Dẻo Đà Lạt",
    category: "Trái cây sấy",
    rating: 5,
    date: "2023-11-10",
    content: "Bơ sấy nhưng vẫn giữ được độ dẻo và màu xanh tự nhiên. Ăn chung với sữa chua Hy Lạp buổi sáng là hết nước chấm!",
    sentiment: "positive"
  },
  {
    id: 7,
    userName: "Đỗ Quang Khải",
    avatar: "https://i.pravatar.cc/150?u=7",
    productName: "Bơ Sấy Giòn (Freeze Dried)",
    category: "Trái cây sấy",
    rating: 1,
    date: "2023-11-12",
    content: "Thất vọng. Bơ bị cứng quá mức, ăn cảm giác như đang nhai đá. Mùi cũng không còn thơm như bơ tươi.",
    sentiment: "negative"
  },

  // --- NHÓM MỸ PHẨM TỪ BƠ (BEAUTY) ---
  {
    id: 8,
    userName: "Ngô Lan Anh",
    avatar: "https://i.pravatar.cc/150?u=8",
    productName: "Mặt Nạ Bơ Cấp Ẩm Chuyên Sâu",
    category: "Làm đẹp",
    rating: 5,
    date: "2023-11-20",
    content: "Cấp ẩm siêu đỉnh cho mùa đông. Đắp xong da mềm mướt như da em bé. Mùi bơ thơm nhẹ thư giãn lắm.",
    sentiment: "positive"
  },
  {
    id: 9,
    userName: "Bùi Thị Bích",
    avatar: "https://i.pravatar.cc/150?u=9",
    productName: "Sữa Rửa Mặt Tinh Chất Bơ",
    category: "Làm đẹp",
    rating: 4,
    date: "2023-11-22",
    content: "Sữa rửa mặt dịu nhẹ, không tạo nhiều bọt nên rửa xong không bị khô căng da. Phù hợp cho da nhạy cảm.",
    sentiment: "positive"
  },
  {
    id: 10,
    userName: "Trương Gia Huy",
    avatar: "https://i.pravatar.cc/150?u=10",
    productName: "Son Dưỡng Môi Bơ & Mật Ong",
    category: "Làm đẹp",
    rating: 3,
    date: "2023-11-25",
    content: "Dưỡng ẩm ổn nhưng chất son hơi bóng quá, bôi lên cảm giác hơi nặng môi. Chỉ nên dùng buổi tối trước khi ngủ.",
    sentiment: "neutral"
  }
];

// Gợi ý hàm thống kê đơn giản để bạn dùng cho BarChart
export const getSentimentStats = () => {
  const stats = { positive: 0, neutral: 0, negative: 0 };
  mockComments.forEach(comment => {
    if (stats[comment.sentiment] !== undefined) {
      stats[comment.sentiment]++;
    }
  });
  return stats;
};