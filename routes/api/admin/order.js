var orderService = require('../../../services/order');

var express = require('express');
var router = express.Router();


router.get('/getpending',orderService.getPendingOrderList);

//router.get('/getapproved',orderService);

router.get('/getallorder',orderService.getOrderList);

router.post('/orderstatus',orderService.orderStatus)



module.exports = router;