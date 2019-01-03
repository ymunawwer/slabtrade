var dealsCtrl = require('../../../controllers/admin/deals');
var express = require('express');
var router = express.Router();

router.post('/createdeal',dealsCtrl.createDeal);

module.exports = router;