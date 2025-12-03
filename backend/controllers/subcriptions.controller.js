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

    async getAllSubs(req, res){
        try {
            const { duration } = req.query
            const subs = await SubcriptionService.getAllSubcriptions(duration)
            return res.status(200).json(subs)
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async updateSubcription(req, res){
        try {
            const { sub_id } = req.params
            const updatedSub = await SubcriptionService.updateSubcription(sub_id, req.body)
            if (!updatedSub) return res.status(400).json({message: "Update Fail!"})
            return res.status(200).json({...updatedSub})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async getSubcriptionById(req, res){
        try {
            const { sub_id } = req.params
            const sub = await SubcriptionService.getSubcriptionById(sub_id)
            if (!sub) return res.status(404).json({message: "Subcription not found!"})
            return res.status(200).json(sub)
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async getUserSubcriptions(req, res){
        try {
            const uid = req.user.uid
            const subs = await SubcriptionService.getUserSubcriptions(uid)
            return res.status(200).json(subs)
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async subscribe(req, res){
        try {
            const uid = req.user.uid
            const { sub_id } = req.params
            const newSub = await SubcriptionService.registerSubcription(uid, sub_id)
            if (!newSub) return res.status(400).json({message: "Subscribe Fail!"})
            return res.status(201).json({...newSub})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}

module.exports = new SubcriptionController()