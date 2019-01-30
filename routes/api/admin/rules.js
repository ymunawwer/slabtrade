const rulesService = require('../../../services/rules');
const auth = require('../../../middlewares/auth')
const express = require('express')
const router = express.Router();

router.post('/add',auth.checkAdminToken,rulesService.createRule);
router.get('/getrules',auth.checkAdminToken,rulesService.getAllRules);
router.get('/remove',auth.checkAdminToken,rulesService.removeRules);
router.post('/update')