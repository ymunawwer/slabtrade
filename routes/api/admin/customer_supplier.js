var express = require('express');
var router = express.Router();
var auth = require('../../../middlewares/auth');
var confirmCtrl = require('../../../controllers/admin/confirmation');
var countCtrl = require('../../../controllers/admin/count')
router.get('/list',auth.checkAdminToken,confirmCtrl.allUser);
router.get('/approve',auth.checkAdminToken,confirmCtrl.approveUser);
router.get('/reject',auth.checkAdminToken,confirmCtrl.rejectUser);
router.get('/count',auth.checkAdminToken,countCtrl.supplierCount);
router.get('/customercount',auth.checkAdminToken,countCtrl.customerCount);




module.exports = router;