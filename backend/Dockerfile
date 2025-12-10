# Sử dụng image Node.js LTS chính thức làm base image
FROM node:lts-slim

# Thiết lập thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
# để cài đặt dependencies một cách hiệu quả hơn (tận dụng layer caching)
COPY package*.json ./

# Cài đặt dependencies của ứng dụng
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng Express đang lắng nghe
EXPOSE 3000

# Lệnh mặc định để chạy ứng dụng khi container khởi động
CMD [ "node", "server.js" ]