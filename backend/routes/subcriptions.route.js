const express = require('express')
const router = express.Router()
const SubcriptionController = require('../controllers/subcriptions.controller')
const { authen } = require('../middlewares/authentication.middleware')
const { authorize } = require('../middlewares/authorization.middleware')

router.post('/',authen, authorize(['admin']), SubcriptionController.createSub)

module.exports=router