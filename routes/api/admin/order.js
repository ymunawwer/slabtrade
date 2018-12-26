var orderService = require('../../../services/order');
var bundleUpdate = require('../../../middlewares/upload');
var orderCtrl = require('../../../controllers/admin/orders');
var payment = require('../../../controllers/admin/payment')
var express = require('express');
var router = express.Router();


router.get('/getpending',orderService.getPendingOrderList);

//router.get('/getapproved',orderService);

router.get('/getallorder',orderService.getOrderList);

router.get('/shippingdownload',orderService.getShippingDoc);

//uploadWireDetail
router.post('/uploadshippingdetail',bundleUpdate.wired_doc_upload.array('wired_file',7),orderCtrl.uploadWireDetail);

router.post('/orderstatus',orderService.orderStatus)

router.get('/paymentstatusupdate',payment.updateStatus);




module.exports = router;