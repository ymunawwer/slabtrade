var express = require('express');
var router = express.Router();
var auth = require('../../../middlewares/auth')




router.use('/user',
    require('./user'));


router.use('/customer',
    require('./customer_supplier'));



router.use('/port',
    require('./port'))

router.use('/order',auth.checkAdminToken,require('./order'));



module.exports = router;