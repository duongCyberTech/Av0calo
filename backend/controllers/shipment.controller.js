const pool = require('../config/db');

class ShipmentController {
    // [GET] /shipments
    async getAllShipments(req, res) {
        try {
            const [rows] = await pool.query(`SELECT * FROM shipment`);
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ShipmentController();