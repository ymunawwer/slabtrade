var materialService = require('../../../services/material');
var auth = require('../../../middlewares/auth')
var express = require('express')
var router = express.Router();

router.post('/add',auth.checkAdminToken,materialService.createMaterial);
router.get('/remove',auth.checkAdminToken,materialService.removeMaterial);
router.get('/getmaterial',auth.checkAdminToken,materialService.getAllMaterial);


module.exports = router