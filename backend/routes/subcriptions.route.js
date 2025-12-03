const express = require('express')
const router = express.Router()
const SubcriptionController = require('../controllers/subcriptions.controller')
const { authen } = require('../middlewares/authentication.middleware')
const { authorize } = require('../middlewares/authorization.middleware')

router.use(authen)

router.post('/', authorize(['admin']), SubcriptionController.createSub)
router.get('/', SubcriptionController.getAllSubs)
router.patch('/:sub_id', authorize(['admin']), SubcriptionController.updateSubcription)
router.get('/:sub_id', SubcriptionController.getSubcriptionById)
router.get('/user/me', SubcriptionController.getUserSubcriptions)
router.post('/subscribe/:sub_id', authorize(['customer']), SubcriptionController.subscribe)

module.exports=router