const express = require('express');
const router = express.Router();
const ShipmentController = require('../controllers/shipment.controller');

router.get('/', ShipmentController.getAllShipments);

module.exports = router;