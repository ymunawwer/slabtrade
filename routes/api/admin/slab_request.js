const requestslabCtrl = require('../../../controllers/admin/requestslab')
var auth = require('../../../middlewares/auth');
var express = require('express');
var router = express.Router();

router.get('/confirmrequest',auth.checkAdminToken,requestslabCtrl.confirmRequest);

router.get('/getrequest',auth.checkAdminToken,requestslabCtrl.getSlabRequest);
module.exports = router