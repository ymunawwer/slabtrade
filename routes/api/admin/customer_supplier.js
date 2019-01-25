var express = require('express');
var router = express.Router();
var auth = require('../../../middlewares/auth');
var confirmCtrl = require('../../../controllers/admin/confirmation');
var countCtrl = require('../../../controllers/admin/count')
var supplierCtrl = require('../../../controllers/admin/supplier')
router.get('/list',auth.checkAdminToken,confirmCtrl.allUser);
router.get('/approve',auth.checkAdminToken,confirmCtrl.approveUser);
router.get('/typeupdate',auth.checkAdminToken,confirmCtrl.updateType);
router.get('/reject',auth.checkAdminToken,confirmCtrl.rejectUser);
router.get('/count',auth.checkAdminToken,countCtrl.supplierCount);
router.get('/customercount',auth.checkAdminToken,countCtrl.customerCount);
router.get('/setmode',auth.checkAdminToken,supplierCtrl.setMode);
router.get('/getbundle',auth.checkAdminToken,supplierCtrl.getProductBySupplierId);
router.get('/verifyBundle',auth.checkAdminToken,supplierCtrl.setProductVerification);



module.exports = router;