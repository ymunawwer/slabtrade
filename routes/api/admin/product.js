const productCtrl =require('../../../controllers/admin/product')
const auth = require('../../../middlewares/auth')
const express = require('express')
const router = express.Router();

router.post('/slabpercent',auth.checkAdminToken,productCtrl.editSlabPercent);

module.exports = router;