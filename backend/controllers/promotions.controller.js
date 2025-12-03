const PromotionsService = require('../services/promotions.service');

class PromotionsController {
    async createPromotion(req, res) {
        try {
            const result = await PromotionsService.createPromotion(req.body);
            return res.status(result.status).json({ message: result.message, data: result.data || null });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getAllPromotions(req, res) {
        try {
            const params = req.query;
            const result = await PromotionsService.getAllPromotions(params);
            return res.status(result.status).json({ message: result.message, data: result.data || null });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new PromotionsController();