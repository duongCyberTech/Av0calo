import React, { useState, useEffect, useMemo } from "react";
import { getAllUsers, updateUserStatus } from "../services/userService";
import logo from "../assets/logo.png";

const MOCK_PRODUCTS = [
  { pid: "SP01", name: "Hạt bơ rang muối", category: "Đồ ăn vặt", price: 80000, stock: 15, sold: 60 },
  { pid: "SP02", name: "Sốt Mayonnaise bơ Lite", category: "Nước sốt", price: 155000, stock: 45, sold: 35 },
  { pid: "SP03", name: "Thanh Granola bơ", category: "Thực phẩm", price: 85000, stock: 8, sold: 65 },
  { pid: "SP04", name: "Xịt dầu bơ", category: "Tinh dầu", price: 245000, stock: 25, sold: 51 },
  { pid: "SP05", name: "Xốt bơ cay nồng", category: "Nước sốt", price: 180000, stock: 12, sold: 37 },
  { pid: "SP06", name: "Xốt bơ vị dịu", category: "Nước sốt", price: 170000, stock: 18, sold: 44 },
  { pid: "SP07", name: "Viên Protein bơ", category: "Thực phẩm", price: 110000, stock: 30, sold: 55 },
  { pid: "SP08", name: "Snack bơ giòn", category: "Đồ ăn vặt", price: 95000, stock: 5, sold: 68 },
  { pid: "SP09", name: "Dầu bơ nguyên chất cao cấp", category: "Tinh dầu", price: 320000, stock: 20, sold: 120 },
  ...Array.from({ length: 11 }).map((_, i) => ({
    pid: `SP${10 + i}`,
    name: `Sản phẩm bơ bổ sung ${i + 1}`,
    category: "Khác",
    price: 100000,
    stock: 50,
    sold: 10 + i
  }))
];
const MOCK_ORDERS = Array.from({ length: 20 }).map((_, i) => ({
  oid: `DH-${900 + i}`,
  customer: ["Mai Đăng Dương", "Phạm Duy Hưng", "Chế Minh Đức", "Hồ Bắc Nam", "Lê Đông Hà", "Hoài Phúc"][i % 6],
  total: Math.floor(Math.random() * 1500000) + 100000,
  status: ["Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"][i % 4],
  date: `2024-03-${(i % 28) + 1}`
}));

const GROWTH_CHART = [
  { month: "T1", val: 45 }, { month: "T2", val: 80 }, { month: "T3", val: 60 },
  { month: "T4", val: 20 }, { month: "T5", val: 95 }, { month: "T6", val: 50 },
  { month: "T7", val: 80 }, { month: "T8", val: 10 }, { month: "T9", val: 90 },
  { month: "T10", val: 50 }, { month: "T11", val: 70 }, { month: "T12", val: 120 },
];

const ACTIVITY_LOGS = [
  { id: 1, time: "10:30", action: "Đơn hàng DH-912 đã đóng gói", user: "Kho" },
  { id: 2, time: "09:15", action: "Khách hàng mới đăng ký gói định kỳ", user: "Hệ thống" },
  { id: 3, time: "08:00", action: "Cập nhật giá Bơ Sáp 034", user: "Admin" },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => { setCurrentPage(1); }, [activeTab, searchTerm]);

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 p-6 bg-white border-t border-gray-50">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-green-50 text-gray-400"><i className="fas fa-chevron-left"></i></button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-[#266A29] text-white' : 'text-gray-400 hover:bg-green-50'}`}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-green-50 text-gray-400"><i className="fas fa-chevron-right"></i></button>
      </div>
    );
  };

  // --- VIEW 1: TRANG TỔNG QUAN ---
  const DashboardBI = () => {
    const top5 = [...MOCK_PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);
    const maxVal = 200; // Cố định mốc trục tung cao nhất là 500
    const yAxisTicks = [200, 160, 120, 80, 40, 0];

    return (
      <div className="animate-fadeIn space-y-12">
        {/* Chỉ số nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-[#266A29] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Doanh thu tháng</p>
            <h3 className="text-4xl font-black mt-2">28.4M</h3>
            <i className="fas fa-wallet absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-110 transition-transform"></i>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-green-50">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Sắp hết hàng</p>
            <h3 className="text-4xl font-black text-red-500 mt-2">08</h3>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-green-50">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Đơn mới hôm nay</p>
            <h3 className="text-4xl font-black text-[#266A29] mt-2">12</h3>
          </div>
          <div className="bg-[#91EAAF] p-8 rounded-[40px] text-[#266A29]">
            <p className="opacity-60 text-[10px] font-black uppercase tracking-widest">Khách mới tháng này</p>
            <h3 className="text-4xl font-black mt-2">+120</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* BIỂU ĐỒ CÓ TRỤC TUNG (Y-AXIS) */}
          <div className="bg-white p-12 rounded-[50px] shadow-sm border border-green-50 lg:col-span-2">
            <h3 className="text-2xl font-black text-[#266A29] mb-12">Tăng trưởng khách hàng</h3>
            <div className="flex h-72">
              {/* Trục tung */}
              <div className="flex flex-col justify-between text-[10px] font-bold text-gray-400 pr-4 pb-8 border-r border-gray-100">
                {yAxisTicks.map(tick => <span key={tick}>{tick}</span>)}
              </div>
              
              {/* Khu vực biểu đồ */}
              <div className="flex-1 flex items-end justify-between px-6 relative h-full">
                {/* Các đường kẻ ngang (Grid lines) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-6">
                  {yAxisTicks.map(tick => <div key={tick} className="w-full border-t border-gray-50 h-0"></div>)}
                </div>

                {/* Các cột dữ liệu */}
                {GROWTH_CHART.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end z-10">
                    <div 
                      className="w-3/5 bg-[#F1F8E9] group-hover:bg-[#266A29] rounded-t-xl transition-all duration-500 relative cursor-pointer" 
                      style={{ height: `${(d.val / maxVal) * 100}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 font-black shadow-xl">
                        {d.val} khách
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-4 font-black">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BÁN CHẠY NHẤT (TOP SELLERS) TỐI ƯU */}
          <div className="bg-white p-12 rounded-[60px] shadow-sm border border-green-50">
            <h3 className="text-2xl font-black text-[#266A29] mb-10 tracking-tight flex items-center gap-3">
              <i className="fas fa-crown text-yellow-500"></i> Sản phẩm HOT
            </h3>
            <div className="space-y-8">
              {top5.map((p, i) => (
                <div key={p.pid} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      {/* Huy hiệu thứ hạng */}
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm
                        ${i === 0 ? 'bg-yellow-400 text-white shadow-yellow-200' : 
                          i === 1 ? 'bg-gray-300 text-white' : 
                          i === 2 ? 'bg-orange-300 text-white' : 'bg-gray-50 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#266A29] group-hover:text-green-600 transition-colors line-clamp-1">{p.name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{p.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#266A29]">{p.sold.toLocaleString()}</span>
                  </div>
                  {/* Thanh tiến độ thiết kế mới */}
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden p-[2px]">
                     <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#91EAAF] to-[#266A29] transition-all duration-1000 ease-out" 
                        style={{width: `${(p.sold / top5[0].sold) * 100}%`}}
                     ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEW 2: QUẢN LÝ NGƯỜI DÙNG (API THẬT) ---
  const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      getAllUsers().then(data => {
        setUsers(Array.isArray(data) ? data : data.result || []);
        setLoading(false);
      }).catch(() => showAlert("Lỗi tải API người dùng", "error"));
    }, []);

    const filtered = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.fname.toLowerCase().includes(searchTerm.toLowerCase()));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="bg-white rounded-[40px] shadow-sm border border-green-50 overflow-hidden animate-fadeIn">
        <table className="w-full text-left">
          <thead className="bg-[#266A29] text-white">
            <tr className="text-[10px] font-bold uppercase tracking-widest">
              <th className="p-8">Khách hàng</th>
              <th className="p-8">Email</th>
              <th className="p-8 text-center">Trạng thái</th>
              <th className="p-8 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan="4" className="p-20 text-center animate-pulse opacity-40">Đang tải người dùng...</td></tr> : 
              paginated.map(u => (
              <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                <td className="p-8 font-bold text-[#266A29]">{u.fname} {u.lname}</td>
                <td className="p-8 text-sm text-gray-500">{u.email}</td>
                <td className="p-8 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{u.status ? 'Hoạt động' : 'Đã khóa'}</span>
                </td>
                <td className="p-8 text-center">
                  <button onClick={() => { updateUserStatus(u.uid, !u.status); showAlert("Cập nhật trạng thái thành công"); }} className="text-orange-500 hover:scale-125 transition-transform"><i className="fas fa-user-lock"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalItems={filtered.length} />
      </div>
    );
  };

  // --- VIEW 3: QUẢN LÝ SẢN PHẨM ---
  const ProductManagement = () => {
    const filtered = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="bg-white rounded-[40px] shadow-sm border border-green-50 overflow-hidden animate-fadeIn">
        <table className="w-full text-left">
          <thead className="bg-[#266A29] text-white">
            <tr className="text-[10px] font-bold uppercase tracking-widest">
              <th className="p-8">Mã SP</th>
              <th className="p-8">Tên sản phẩm</th>
              <th className="p-8 text-center">Tồn kho</th>
              <th className="p-8 text-right">Giá bán</th>
              <th className="p-8 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map(p => (
              <tr key={p.pid} className="hover:bg-green-50/20 transition-colors">
                <td className="p-8 font-mono text-gray-400 text-xs">{p.pid}</td>
                <td className="p-8 font-bold text-[#266A29]">{p.name}</td>
                <td className={`p-8 text-center font-black ${p.stock < 20 ? 'text-red-500 underline' : 'text-gray-800'}`}>{p.stock}</td>
                <td className="p-8 text-right font-black">{p.price.toLocaleString()}đ</td>
                <td className="p-8 text-center">
                  <div className="flex justify-center gap-3">
                    <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><i className="fas fa-edit"></i></button>
                    <button className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalItems={filtered.length} />
      </div>
    );
  };

  // --- VIEW 4: QUẢN LÝ ĐƠN HÀNG ---
  const OrderManager = () => {
    const filtered = MOCK_ORDERS.filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="bg-white rounded-[40px] shadow-sm border border-green-50 overflow-hidden animate-fadeIn">
        <table className="w-full text-left">
          <thead className="bg-[#91EAAF] text-[#266A29]">
            <tr className="text-[10px] font-bold uppercase tracking-widest">
              <th className="p-8">Mã đơn</th>
              <th className="p-8">Khách hàng</th>
              <th className="p-8 text-right">Tổng tiền</th>
              <th className="p-8 text-center">Trạng thái</th>
              <th className="p-8 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map(o => (
              <tr key={o.oid} className="hover:bg-gray-50 transition-colors">
                <td className="p-8 font-mono text-gray-400 text-xs">{o.oid}</td>
                <td className="p-8 font-bold">{o.customer}</td>
                <td className="p-8 text-right font-black text-[#266A29]">{o.total.toLocaleString()}đ</td>
                <td className="p-8 text-center text-[10px] font-bold uppercase">
                  <span className={`px-3 py-1 rounded-full ${o.status === "Đã giao" ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                </td>
                <td className="p-8 text-center">
                  <div className="flex justify-center gap-3">
                    <button className="w-9 h-9 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"><i className="fas fa-eye"></i></button>
                    <button className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalItems={filtered.length} />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F1F8E9] font-['Josefin_Sans'] relative overflow-x-hidden">
      
      {/* ALERT TOAST */}
      {alert.show && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-4 px-8 py-5 rounded-[30px] shadow-2xl bg-white border-b-8 animate-bounce ${alert.type === 'success' ? 'border-green-500 text-green-900' : 'border-red-500 text-red-900'}`}>
          <i className={`fas fa-${alert.type === 'success' ? 'check-circle text-green-500' : 'times-circle text-red-500'} text-2xl`}></i>
          <span className="font-bold">{alert.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#266A29] text-white flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-10 border-b border-green-800 flex flex-col items-center gap-4">
          <img src={logo} alt="Av0Calo" className="w-56 h-40 object-contain bg-white rounded-2xl p-2" />
          <div className="text-center">
            <p className="text-[16px] uppercase tracking-[0.5em] opacity-40 font-black">ADMIN PANEL</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 mt-6">
          {[
            { id: 'dashboard', name: 'Trang tổng quan', icon: 'chart-pie' },
            { id: 'users', name: 'Quản lý người dùng', icon: 'user-friends' },
            { id: 'products', name: 'Quản lý sản phẩm', icon: 'leaf' },
            { id: 'orders', name: 'Quản lý đơn hàng', icon: 'shopping-basket' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-6 py-5 rounded-[25px] transition-all duration-500 ${activeTab === item.id ? 'bg-[#91EAAF] text-[#266A29] font-black shadow-lg scale-105' : 'hover:bg-green-700 opacity-60'}`}>
              <i className={`fas fa-${item.icon} text-lg`}></i>
              <span className="text-sm font-black tracking-tight">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-72 flex-1 p-16">
        <header className="flex justify-between items-center mb-16">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-[#266A29] tracking-tighter capitalize">
              {activeTab === 'dashboard' ? 'Tổng quan' : activeTab === 'users' ? 'Người dùng' : activeTab === 'products' ? 'Sản phẩm' : 'Đơn hàng'}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-[#266A29]">Av0Calo Business OS</p>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nhanh..." 
                  className="pl-14 pr-8 py-4 rounded-full bg-white shadow-sm w-96 outline-none focus:ring-4 focus:ring-[#91EAAF]/20 transition-all font-bold text-[#266A29]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-6 top-5 text-gray-300"></i>
             </div>
             <button onClick={() => showAlert("Đang chuẩn bị xuất báo cáo Excel...")} className="bg-white text-[#266A29] font-black text-[10px] px-6 py-4 rounded-full shadow-sm hover:bg-[#266A29] hover:text-white transition-all border border-green-50">XUẤT BÁO CÁO</button>
             <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-green-50">
                <div className="w-10 h-10 bg-[#266A29] text-[#91EAAF] rounded-xl flex items-center justify-center font-black">AD</div>
                <div className="text-xs text-right">
                  <p className="font-black text-[#266A29]">Super Admin</p>
                  <p className="text-green-500 font-bold flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Trực tuyến</p>
                </div>
             </div>
          </div>
        </header>

        <div className="min-h-[60vh]">
          {activeTab === "dashboard" && <DashboardBI />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "orders" && <OrderManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;