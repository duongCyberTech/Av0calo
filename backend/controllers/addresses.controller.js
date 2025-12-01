const AddressService = require('../services/addresses.service');

class AddressController {
    async getAll(req, res) {
        try {
            const uid = req.user.uid;
            const data = await AddressService.getAllAddresses(uid);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const uid = req.user.uid;
            const { street, district, city, isDefault } = req.body;

            if (!street || !district || !city) {
                return res.status(400).json({ message: "Vui lòng nhập đủ Địa chỉ, Quận/Huyện, Tỉnh/Thành" });
            }

            const newAddress = await AddressService.addAddress(uid, { street, district, city, isDefault });
            return res.status(201).json({ message: "Thêm địa chỉ thành công", data: newAddress });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const uid = req.user.uid;
            const { aid } = req.params;
            
            await AddressService.updateAddress(uid, aid, req.body);
            return res.status(200).json({ message: "Cập nhật thành công" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const uid = req.user.uid;
            const { aid } = req.params;

            await AddressService.deleteAddress(uid, aid);
            return res.status(200).json({ message: "Xóa địa chỉ thành công" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AddressController();