const PromotionsController = require('../controllers/promotions.controller');
const express = require('express');
const router = express.Router();

router.post('/', PromotionsController.createPromotion);
router.get('/', PromotionsController.getAllPromotions);

module.exports = router;