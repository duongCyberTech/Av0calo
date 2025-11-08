const SubcriptionService = require('../services/subcriptions.service')

class SubcriptionController {
    async createSub(req, res){
        try {
            const newSub = await SubcriptionService.createSubcription(req.body)

            if (!newSub) return res.status(400).json({message: "Create Fail!"})
            return res.status(201).json({...newSub})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}

module.exports = new SubcriptionController()