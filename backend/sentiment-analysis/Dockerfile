# 1. Chọn Base Image (Python phiên bản slim cho nhẹ)
FROM python:3.11-slim

# 2. Thiết lập biến môi trường
# Ngăn Python tạo ra các file .pyc (không cần thiết trong container)
ENV PYTHONDONTWRITEBYTECODE=1
# Đảm bảo log của Python được in ra console ngay lập tức (không bị buffer)
ENV PYTHONUNBUFFERED=1

# 3. Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# 4. Copy file requirements.txt vào container trước
# (Làm bước này trước để tận dụng Docker Cache, giúp build nhanh hơn nếu chỉ sửa code mà không sửa thư viện)
COPY requirements.txt .

# 5. Cài đặt các thư viện
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy toàn bộ code còn lại của dự án vào container
COPY . .

# 7. Mở port (Flask mặc định chạy port 5000)
EXPOSE 5000

# 8. Lệnh chạy ứng dụng
# Lưu ý: Trong môi trường Production nên dùng gunicorn thay vì python app.py
CMD ["python", "app.py"]