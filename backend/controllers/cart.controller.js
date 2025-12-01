const CartService = require('../services/cart.service');

class CartController {

    // [GET] /api/cart
    async getCart(req, res) {
        try {
            const uid = req.user.uid; 
            
            const cartItems = await CartService.getCart(uid);
            
            return res.status(200).json({
                message: "Lấy giỏ hàng thành công",
                data: cartItems
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // [POST] /cart
    // Body: { "pid": "PROD_001", "quantity": 2 }
    async addToCart(req, res) {
        try {
            const uid = req.user.uid;
            const { pid, quantity } = req.body;
            if (!pid || !quantity) {
                return res.status(400).json({ message: "Thiếu Product ID hoặc số lượng" });
            }

            await CartService.addToCart(uid, pid, Number(quantity));
            
            return res.status(200).json({ message: "Đã thêm vào giỏ hàng" });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
            }
            return res.status(500).json({ message: error.message });
        }
    }

    // [PUT] /cart
    async updateCart(req, res) {
        try {
            const uid = req.user.uid;
            const { pid, quantity } = req.body;

            if (!pid || quantity === undefined) {
                return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
            }

            await CartService.updateQuantity(uid, pid, Number(quantity));
            return res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // [DELETE] /cart/:pid
    // Xóa 1 sản phẩm
    async removeItem(req, res) {
        try {
            const uid = req.user.uid;
            const { pid } = req.params;
            
            await CartService.removeFromCart(uid, pid);
            return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // [DELETE] /api/cart
    // Xóa HẾT giỏ hàng
    async clearCart(req, res) {
        try {
            const uid = req.user.uid;
            await CartService.clearCart(uid);
            return res.status(200).json({ message: "Giỏ hàng đã được làm trống" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CartController();