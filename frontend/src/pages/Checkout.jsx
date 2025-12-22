import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getCart } from '../services/cartService';
import { createOrder } from '../services/orderService';
import { createPaymentUrl } from '../services/paymentService';
import { getAddresses, createAddress, deleteAddress } from '../services/addressService';
import { getPromotions } from '../services/promotionService';
import { fetchJSON } from '../utils/api';
import { isAuthenticated } from '../services/userService';
import { CreditCard, MapPin, Truck, Loader, X, Plus, Tag } from 'lucide-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedShipment, setSelectedShipment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'online'
  const [bankCode, setBankCode] = useState('');
  const [note, setNote] = useState('');
  
  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [discountError, setDiscountError] = useState('');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [searchingPromotion, setSearchingPromotion] = useState(false);
  
  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    district: '',
    city: '',
    isDefault: false
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load cart, addresses, and shipments in parallel
      const [cartData, addressesData, shipmentsData] = await Promise.all([
        getCart(),
        getAddresses(),
        fetchJSON('/shipments', { method: 'GET' })
      ]);

      setCartItems(cartData);
      setAddresses(addressesData);
      setShipments(shipmentsData);

      // Set default address if available
      if (addressesData.length > 0) {
        const defaultAddr = addressesData.find(addr => addr.isDefault) || addressesData[0];
        setSelectedAddress(defaultAddr.aid);
      }

      // Set default shipment if available
      if (shipmentsData.length > 0) {
        setSelectedShipment(shipmentsData[0].ship_id);
      }

      setError(null);
    } catch (err) {
      setError(err.body?.message || 'Không thể tải dữ liệu');
      console.error('Error loading checkout data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.sell_price * item.quantity);
    }, 0);
  };

  const calculateShippingFee = () => {
    if (!selectedShipment || shipments.length === 0) return 0;
    const shipment = shipments.find(s => s.ship_id === selectedShipment);
    return shipment?.price || 0;
  };

  const calculateDiscount = (subtotal, promotion) => {
    if (!promotion) return 0;
    
    const { discount_type, discount_num, max_discount } = promotion;
    
    if (discount_type === 'percent') {
      const discount = subtotal * (Number(discount_num) / 100);
      const maxDiscount = max_discount ? Number(max_discount) : discount;
      return Math.min(discount, maxDiscount);
    } else {
      return Math.min(Number(discount_num), subtotal);
    }
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    const shipping = calculateShippingFee();
    const discount = selectedPromotion ? calculateDiscount(subtotal, selectedPromotion) : 0;
    return Math.max(0, subtotal + shipping - discount);
  };

  const loadPromotions = async (search = '') => {
    try {
      const response = await getPromotions(search);
      if (response && response.data) {
        setAvailablePromotions(response.data);
      }
    } catch (err) {
      console.error('Error loading promotions:', err);
    }
  };

  const handleSearchPromotion = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setSearchingPromotion(true);
      setDiscountError('');
      await loadPromotions(discountCode);
      setShowPromotionModal(true);
    } catch (err) {
      setDiscountError('Không thể tải danh sách mã giảm giá');
      console.error('Error searching promotion:', err);
    } finally {
      setSearchingPromotion(false);
    }
  };

  const handleSelectPromotion = (promotion) => {
    const subtotal = calculateTotal();
    const discount = calculateDiscount(subtotal, promotion);
    
    if (discount > 0 && promotion.stock > 0) {
      setSelectedPromotion(promotion);
      setDiscountCode(promotion.title);
      setDiscountError('');
      setShowPromotionModal(false);
    } else {
      setDiscountError('Mã giảm giá không áp dụng được cho đơn hàng này');
    }
  };

  const handleRemovePromotion = () => {
    setSelectedPromotion(null);
    setDiscountCode('');
    setDiscountError('');
    setAvailablePromotions([]);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!newAddress.street || !newAddress.district || !newAddress.city) {
      alert('Vui lòng nhập đủ Địa chỉ, Quận/Huyện, Tỉnh/Thành');
      return;
    }

    try {
      setAddingAddress(true);
      const createdAddress = await createAddress(newAddress);
      
      // Reload addresses
      const updatedAddresses = await getAddresses();
      setAddresses(updatedAddresses);
      
      // Select the newly created address
      setSelectedAddress(createdAddress.aid || createdAddress.data?.aid);
      
      // Reset form and close modal
      setNewAddress({ street: '', district: '', city: '', isDefault: false });
      setShowAddressModal(false);
      setError(null);
    } catch (err) {
      setError(err.body?.message || 'Không thể thêm địa chỉ. Vui lòng thử lại.');
      console.error('Error adding address:', err);
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (aid, e) => {
    e.stopPropagation(); // Prevent selecting the address when clicking delete
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      setDeletingAddressId(aid);
      await deleteAddress(aid);
      
      // Reload addresses
      const updatedAddresses = await getAddresses();
      setAddresses(updatedAddresses);
      
      // Clear selected address if it was deleted
      if (selectedAddress === aid) {
        if (updatedAddresses.length > 0) {
          const defaultAddr = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
          setSelectedAddress(defaultAddr.aid);
        } else {
          setSelectedAddress('');
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.body?.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.');
      console.error('Error deleting address:', err);
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (paymentMethod === 'online' && !bankCode) {
      alert('Vui lòng chọn ngân hàng để thanh toán');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Create order
      const orderData = {
        aid: selectedAddress,
        ship_id: selectedShipment || null,
        pay_type: paymentMethod,
        note: note || null,
        promo_id: selectedPromotion?.promo_id || null
      };

      const orderResult = await createOrder(orderData);
      const { oid } = orderResult;

      // If online payment, redirect to VNPay
      if (paymentMethod === 'online') {
        const paymentUrl = await createPaymentUrl(oid, bankCode);
        window.location.href = paymentUrl;
      } else {
        // Cash payment - redirect to success page or orders
        navigate(`/orders?success=true&oid=${oid}`);
      }
    } catch (err) {
      setError(err.body?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      console.error('Error creating order:', err);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F9FBF7] min-h-screen">
        <Header />
        <div className="pt-24 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin text-[#74D978] mx-auto mb-4" size={32} />
            <p className="text-[#38491E]">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F9FBF7] min-h-screen">
        <Header />
        <div className="pt-24 text-center py-16">
          <p className="text-xl text-gray-600 mb-4">Giỏ hàng trống</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-[#74D978] text-[#2E4A26] font-bold px-6 py-3 rounded-full hover:bg-[#91EAAF] transition"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FBF7] min-h-screen font-['Quicksand']">
      <Header />
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2E4A26] mb-8">Thanh toán</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#74D978]" size={24} />
                  <h2 className="text-xl font-bold text-[#2E4A26]">Địa chỉ giao hàng</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 text-[#74D978] hover:text-[#91EAAF] font-medium transition"
                >
                  <Plus size={18} />
                  Thêm địa chỉ mới
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.aid}
                      className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddress === addr.aid
                          ? 'border-[#74D978] bg-[#F9FBF7]'
                          : 'border-gray-200 hover:border-[#74D978]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.aid}
                        checked={selectedAddress === addr.aid}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2E4A26]">
                            {addr.street}, {addr.district}, {addr.city}
                          </span>
                          {addr.isDefault && (
                            <span className="bg-[#74D978] text-[#2E4A26] text-xs px-2 py-1 rounded">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAddress(addr.aid, e)}
                        disabled={deletingAddressId === addr.aid}
                        className="ml-2 text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa địa chỉ"
                      >
                        {deletingAddressId === addr.aid ? (
                          <Loader className="animate-spin" size={18} />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Shipment Method */}
            {shipments.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="text-[#74D978]" size={24} />
                  <h2 className="text-xl font-bold text-[#2E4A26]">Phương thức vận chuyển</h2>
                </div>
                <select
                  value={selectedShipment}
                  onChange={(e) => setSelectedShipment(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                >
                  {shipments.map((ship) => (
                    <option key={ship.ship_id} value={ship.ship_id}>
                      {ship.delivery || 'Giao hàng tiêu chuẩn'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-[#74D978]" size={24} />
                <h2 className="text-xl font-bold text-[#2E4A26]">Phương thức thanh toán</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#74D978]/50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="font-medium text-[#2E4A26]">Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#74D978]/50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="font-medium text-[#2E4A26]">Thanh toán online (VNPay)</span>
                </label>

                {paymentMethod === 'online' && (
                  <div className="ml-8 mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn ngân hàng:
                    </label>
                    <select
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                      required
                    >
                      <option value="">-- Chọn ngân hàng --</option>
                      <option value="NCB">Ngân hàng NCB</option>
                      <option value="VIETCOMBANK">Vietcombank</option>
                      <option value="VIETINBANK">VietinBank</option>
                      <option value="BIDV">BIDV</option>
                      <option value="AGRIBANK">Agribank</option>
                      <option value="SACOMBANK">Sacombank</option>
                      <option value="TECHCOMBANK">Techcombank</option>
                      <option value="ACB">ACB</option>
                      <option value="TPBANK">TPBank</option>
                      <option value="MBBANK">MB Bank</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Discount Code */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="text-[#74D978]" size={24} />
                <h2 className="text-xl font-bold text-[#2E4A26]">Mã giảm giá</h2>
              </div>
              
              {selectedPromotion ? (
                <div className="bg-[#F9FBF7] border-2 border-[#74D978] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#2E4A26]">{selectedPromotion.title}</p>
                      <p className="text-sm text-gray-600">
                        {selectedPromotion.discount_type === 'percent' 
                          ? `Giảm ${selectedPromotion.discount_num}% (tối đa ${selectedPromotion.max_discount?.toLocaleString('vi-VN')}đ)`
                          : `Giảm ${selectedPromotion.discount_num.toLocaleString('vi-VN')}đ`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromotion}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchPromotion()}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSearchPromotion}
                      disabled={searchingPromotion}
                      className="bg-[#74D978] text-[#2E4A26] font-medium px-6 py-3 rounded-lg hover:bg-[#91EAAF] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {searchingPromotion ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Đang tìm...
                        </>
                      ) : (
                        'Áp dụng'
                      )}
                    </button>
                  </div>
                  
                  {discountError && (
                    <p className="text-red-500 text-sm">{discountError}</p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromotionModal(true);
                      loadPromotions();
                    }}
                    className="text-[#74D978] hover:text-[#91EAAF] text-sm font-medium transition"
                  >
                    Chọn hoặc nhập mã giảm giá
                  </button>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lời nhắn cho shop (tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                placeholder="Nhập ghi chú cho đơn hàng..."
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2E4A26] mb-4">Đơn hàng của bạn</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.pid} className="flex gap-3 text-sm">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[#2E4A26]">{item.title}</p>
                      <p className="text-gray-600">
                        {item.quantity} x {item.sell_price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng:</span>
                  <span>{calculateTotal().toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedPromotion && calculateDiscount(calculateTotal(), selectedPromotion) > 0 && (
                  <div className="flex justify-between text-[#74D978]">
                    <span>Đã giảm:</span>
                    <span>-{calculateDiscount(calculateTotal(), selectedPromotion).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng:</span>
                  <span>{calculateShippingFee().toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-[#2E4A26]">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#74D978]">
                    {calculateFinalTotal().toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || !selectedAddress}
                className="w-full bg-[#74D978] text-[#2E4A26] font-bold py-3 rounded-full hover:bg-[#91EAAF] transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt hàng'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#2E4A26]">Thêm địa chỉ mới</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false);
                    setNewAddress({ street: '', district: '', city: '', isDefault: false });
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddAddress} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                    placeholder="Nhập số nhà, tên đường..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                    placeholder="Nhập quận/huyện..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                    placeholder="Nhập tỉnh/thành phố..."
                    required
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="w-4 h-4 text-[#74D978] border-gray-300 rounded focus:ring-[#74D978]"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setNewAddress({ street: '', district: '', city: '', isDefault: false });
                      setError(null);
                    }}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition"
                    disabled={addingAddress}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="flex-1 bg-[#74D978] text-[#2E4A26] font-bold py-3 rounded-lg hover:bg-[#91EAAF] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingAddress ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Đang thêm...
                      </>
                    ) : (
                      'Thêm địa chỉ'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Promotion Selection Modal */}
        {showPromotionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#2E4A26]">Chọn mã giảm giá</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowPromotionModal(false);
                    setDiscountError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchPromotion()}
                    placeholder="Tìm kiếm mã giảm giá..."
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#74D978] focus:outline-none"
                  />
                </div>

                {availablePromotions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không tìm thấy mã giảm giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availablePromotions.map((promo) => {
                      const subtotal = calculateTotal();
                      const discount = calculateDiscount(subtotal, promo);
                      const isApplicable = discount > 0 && promo.stock > 0;
                      
                      return (
                        <div
                          key={promo.promo_id}
                          className={`border-2 rounded-lg p-4 transition ${
                            isApplicable
                              ? 'border-[#74D978] bg-[#F9FBF7] cursor-pointer hover:bg-[#F0F8F2]'
                              : 'border-gray-200 bg-gray-50 opacity-60'
                          }`}
                          onClick={() => isApplicable && handleSelectPromotion(promo)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-[#2E4A26] mb-1">{promo.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {promo.discount_type === 'percent' 
                                  ? `Giảm ${promo.discount_num}% (tối đa ${promo.max_discount?.toLocaleString('vi-VN')}đ)`
                                  : `Giảm ${promo.discount_num.toLocaleString('vi-VN')}đ`}
                              </p>
                              {isApplicable && discount > 0 && (
                                <p className="text-sm text-[#74D978] font-medium">
                                  Bạn sẽ tiết kiệm: {discount.toLocaleString('vi-VN')}đ
                                </p>
                              )}
                              {!isApplicable && (
                                <p className="text-sm text-red-500">
                                  {promo.stock <= 0 ? 'Mã đã hết lượt sử dụng' : 'Mã không áp dụng được cho đơn hàng này'}
                                </p>
                              )}
                            </div>
                            {isApplicable && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectPromotion(promo);
                                }}
                                className="ml-4 bg-[#74D978] text-[#2E4A26] font-medium px-4 py-2 rounded-lg hover:bg-[#91EAAF] transition"
                              >
                                Chọn
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;


