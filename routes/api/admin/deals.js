var dealsCtrl = require('../../../controllers/admin/deals');
var express = require('express');
var router = express.Router();

router.post('/createdeal',dealsCtrl.createDeal);
router.get('/getdeal',dealsCtrl.getDeal);

module.exports = router;