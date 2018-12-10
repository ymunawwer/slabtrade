
var express = require('express');
var router = express.Router();
var auth = require('../../../middlewares/auth');
const portCtrl = require('../../../controllers/admin/port');
const portService = require('../../../services/port');



router.post('/add',auth.checkAdminToken,portCtrl.addPort);

router.post('/update',auth.checkAdminToken,portCtrl.updatePort);

router.post('/remove',auth.checkAdminToken,portCtrl.removePort);

router.get('/allport',auth.checkAdminToken,portService.getAllPort);

router.get('/port',auth.checkAdminToken,portService.getPortDetail);


module.exports = router;

