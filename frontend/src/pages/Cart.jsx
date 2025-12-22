import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { isAuthenticated } from '../services/userService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError(err.body?.message || 'Không thể tải giỏ hàng');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (pid, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(pid, newQuantity);
      await loadCart();
    } catch (err) {
      alert(err.body?.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (pid) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await removeFromCart(pid);
      await loadCart();
    } catch (err) {
      alert(err.body?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
    
    try {
      await clearCart();
      await loadCart();
    } catch (err) {
      alert(err.body?.message || 'Không thể xóa giỏ hàng');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.sell_price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="bg-[#F9FBF7] min-h-screen">
        <Header />
        <div className="pt-24 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74D978] mx-auto mb-4"></div>
            <p className="text-[#38491E]">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FBF7] min-h-screen font-['Quicksand']">
      <Header />
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="text-[#2E4A26]" size={32} />
          <h1 className="text-3xl font-bold text-[#2E4A26]">Giỏ hàng của tôi</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate('/product')}
              className="bg-[#74D978] text-[#2E4A26] font-bold px-6 py-3 rounded-full hover:bg-[#91EAAF] transition"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.pid}
                  className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2E4A26] text-lg mb-2">{item.title}</h3>
                    <p className="text-[#74D978] font-bold text-lg mb-3">
                      {item.sell_price.toLocaleString('vi-VN')}đ
                    </p>
                    
                    {/* Stock warning */}
                    {item.stock < item.quantity && (
                      <p className="text-red-500 text-sm mb-2">
                        ⚠️ Chỉ còn {item.stock} sản phẩm
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.pid, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="bg-[#F9FBF7] border border-[#74D978] text-[#2E4A26] rounded-full p-1 hover:bg-[#74D978] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-[#2E4A26] min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.pid, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="bg-[#F9FBF7] border border-[#74D978] text-[#2E4A26] rounded-full p-1 hover:bg-[#74D978] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                      <span className="text-gray-500 text-sm ml-4">
                        Tổng: {(item.sell_price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.pid)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#2E4A26] mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{calculateTotal().toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>0đ</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg text-[#2E4A26]">
                    <span>Tổng cộng:</span>
                    <span className="text-[#74D978]">
                      {calculateTotal().toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#74D978] text-[#2E4A26] font-bold py-3 rounded-full hover:bg-[#91EAAF] transition flex items-center justify-center gap-2"
                >
                  Thanh toán
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;


