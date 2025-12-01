const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/addresses.controller');
const { authen } = require('../middlewares/authentication.middleware');

router.get('/', authen, AddressController.getAll);
router.post('/', authen, AddressController.create);
router.put('/:aid', authen, AddressController.update);
router.delete('/:aid', authen, AddressController.delete);

module.exports = router;