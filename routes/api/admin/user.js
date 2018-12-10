var express = require('express');
var router = express.Router();
var loginCtrl =require('../../../controllers/admin/login');
var ordersCtrl = require('../../../controllers/admin/orders');

router.post('/login',loginCtrl.login);



router.get('/fetchallorders',ordersCtrl.fetchAllOrders);







module.exports = router;
