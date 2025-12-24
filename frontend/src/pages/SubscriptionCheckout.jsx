import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Loader,
  Tag,
  ShoppingBasket,
  Plus,
  Trash2,
  X,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { isAuthenticated } from "../services/userService";
import {
  getAddresses,
  createAddress,
  deleteAddress,
} from "../services/addressService";
import { getPromotions } from "../services/promotionService";
import { fetchJSON } from "../utils/api";
import axios from 'axios'

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscription = location.state?.subscription;

  // States dữ liệu
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' hoặc 'online'
  const [bankCode, setBankCode] = useState("");

  // Promotion States
  const [voucher, setVoucher] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // UI States
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // New Address State
  const [newAddress, setNewAddress] = useState({
    street: "",
    district: "",
    city: "",
    isDefault: false,
  });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (!subscription) {
      navigate("/subscription");
      return;
    }
    loadInitialData();
  }, [navigate, subscription]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const addrData = await getAddresses();
      setAddresses(addrData);

      if (addrData.length > 0) {
        const defaultAddr =
          addrData.find((addr) => addr.isDefault) || addrData[0];
        setSelectedAddress(defaultAddr.aid);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC XỬ LÝ ĐỊA CHỈ ---
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setAddingAddress(true);
      const res = await createAddress(newAddress);
      const updated = await getAddresses();
      setAddresses(updated);
      setSelectedAddress(res.aid || res.data?.aid);
      setShowAddressModal(false);
      setNewAddress({ street: "", district: "", city: "", isDefault: false });
    } catch (err) {
      alert("Không thể thêm địa chỉ");
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (aid, e) => {
    e.stopPropagation();
    if (!window.confirm("Xóa địa chỉ này?")) return;
    try {
      await deleteAddress(aid);
      const updated = await getAddresses();
      setAddresses(updated);
      if (selectedAddress === aid) setSelectedAddress(updated[0]?.aid || "");
    } catch (err) {
      alert("Lỗi khi xóa địa chỉ");
    }
  };

  // --- LOGIC TÍNH TOÁN ---
  const calculateDiscount = () => {
    if (!selectedPromotion) return 0;
    const { discount_type, discount_num, max_discount } = selectedPromotion;
    if (discount_type === "percent") {
      const val = (subscription.price * discount_num) / 100;
      return max_discount ? Math.min(val, max_discount) : val;
    }
    return Math.min(discount_num, subscription.price);
  };

  const discount = calculateDiscount();
  const total = subscription.price - discount;

  // --- LOGIC THANH TOÁN ---
  const handleConfirmRegistration = async () => {
    if (!selectedAddress) return alert("Vui lòng chọn địa chỉ!");

    try {
      setProcessing(true);
      // Giả sử API đăng ký Subscription tương tự Order
      const regData = {
        aid: selectedAddress,
        pay_type: paymentMethod,
        promo_id: selectedPromotion?.promo_id || null,
        sub_id: subscription.id, // ID của gói đăng ký
      };

      const subPay = await axios.post(
        `http://localhost:3000/subcriptions/pay/${regData.sub_id}`,{},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      window.location.href = subPay.data.url
      // logic tạo đăng ký ở đây...
      // await createSubscriptionOrder(regData);

      //navigate("/SubSuccess");
    } catch (err) {
      alert("Lỗi khi đăng ký gói");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#F1F8E9]">
        <Loader className="animate-spin text-green-600" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F1F8E9] font-['Josefin_Sans']">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:text-green-600">
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-5xl font-black italic text-[#2D5A27]">
            Thanh toán gói
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* CỘT TRÁI */}
          <div className="space-y-8 lg:col-span-2">
            {/* ĐỊA CHỈ */}
            <section className="rounded-[30px] bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-green-900">
                  <MapPin /> Địa chỉ nhận hàng
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-1 text-sm font-bold text-green-600 hover:underline"
                >
                  <Plus size={16} /> Thêm địa chỉ
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.aid}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all ${selectedAddress === addr.aid ? "border-green-500 bg-green-50" : "border-gray-100"}`}
                  >
                    <input
                      type="radio"
                      className="accent-green-600"
                      checked={selectedAddress === addr.aid}
                      onChange={() => setSelectedAddress(addr.aid)}
                    />
                    <div className="flex-1">
                      <p className="font-bold">{addr.street}</p>
                      <p className="text-sm text-gray-500">
                        {addr.district}, {addr.city}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteAddress(addr.aid, e)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </label>
                ))}
              </div>
            </section>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <section className="rounded-[30px] bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-green-900">
                <CreditCard /> Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 ${paymentMethod === "online" ? "border-green-500 bg-green-50" : "border-gray-100"}`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <span className="font-bold">Chuyển khoản (VNPay)</span>
                </label>
              </div>

              {paymentMethod === "online" && (
                <select
                  className="mt-4 w-full rounded-xl border-2 p-3 outline-none focus:border-green-500"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  <option value="NCB">Ngân hàng NCB</option>
                  <option value="VIETCOMBANK">Vietcombank</option>
                </select>
              )}
            </section>
          </div>

          {/* CỘT PHẢI: HÓA ĐƠN */}
          <div className="space-y-6">
            <section className="rounded-[30px] border-t-8 border-green-400 bg-white p-8 shadow-xl">
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-black uppercase text-green-900">
                <ShoppingBasket /> Đơn hàng
              </h3>

              <div className="mb-6 flex items-center gap-4 border-b pb-6">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src="/src/assets/SubsCheckout.png"
                    alt="Box"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-green-800">
                    {subscription.name}
                  </p>
                  <p className="text-sm italic text-gray-500">
                    Subscription Box
                  </p>
                </div>
              </div>

              {/* VOUCHER TRONG BILL */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    placeholder="Mã giảm giá..."
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <button
                    onClick={async () => {
                      const res = await getPromotions(voucher);
                      setPromotions(res.data || []);
                      setShowPromoModal(true);
                    }}
                    className="rounded-lg bg-green-100 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-200"
                  >
                    CHỌN
                  </button>
                </div>
              </div>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Giá gốc</span>
                  <span>{subscription.price.toLocaleString()}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-2xl font-black text-green-900">
                <span>TỔNG</span>
                <span>{total.toLocaleString()}đ</span>
              </div>

              <button
                onClick={handleConfirmRegistration}
                disabled={processing}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
              >
                {processing ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐĂNG KÝ"}
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL THÊM ĐỊA CHỈ */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold">Thêm địa chỉ mới</h2>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <input
                required
                placeholder="Số nhà, tên đường..."
                className="w-full rounded-xl border p-3"
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Quận/Huyện"
                  className="rounded-xl border p-3"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, district: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="Tỉnh/Thành"
                  className="rounded-xl border p-3"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={addingAddress}
                className="w-full rounded-xl bg-green-600 py-3 font-bold text-white"
              >
                {addingAddress ? "Đang thêm..." : "Lưu địa chỉ"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-full text-gray-400"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỌN VOUCHER */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-green-900">
                Mã giảm giá khả dụng
              </h2>
              <button onClick={() => setShowPromoModal(false)}>
                <X />
              </button>
            </div>
            <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
              {promotions.map((p) => (
                <div
                  key={p.promo_id}
                  className="group cursor-pointer rounded-2xl border-2 border-gray-100 p-5 transition-all hover:border-green-500 hover:bg-green-50"
                  onClick={() => {
                    setSelectedPromotion(p);
                    setVoucher(p.title);
                    setShowPromoModal(false);
                  }}
                >
                  <p className="text-lg font-bold text-green-700">{p.title}</p>
                  <p className="text-sm text-gray-500">
                    Giảm{" "}
                    {p.discount_type === "percent"
                      ? `${p.discount_num}%`
                      : `${p.discount_num.toLocaleString()}đ`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCheckout;
