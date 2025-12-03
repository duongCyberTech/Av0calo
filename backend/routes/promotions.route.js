const PromotionsController = require('../controllers/promotions.controller');
const express = require('express');
const router = express.Router();
const { authen } = require('../middlewares/authentication.middleware');
const { authorize } = require('../middlewares/authorization.middleware');

// Apply authentication middleware to all promotion routes
router.use(authen);

router.post('/', authorize(['admin']), PromotionsController.createPromotion);
router.get('/', PromotionsController.getAllPromotions);

module.exports = router;