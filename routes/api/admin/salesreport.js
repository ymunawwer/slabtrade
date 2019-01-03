var express = require('express');
var router = express.Router();
var salesreportCtrl = require('../../../controllers/admin/salesreport')


router.get('/salesreport',salesreportCtrl.filter_order);

module.exports = router