var express = require('express');
var router = express.Router();
var auth = require('../../../middlewares/auth')
var geo = require('../../../services/geocoding')


router.use('/product',require('./product'))


router.use('/user',
    require('./user'));

router.get('/geo',geo.geoCoding)

router.use('/customer',
    require('./customer_supplier'));

router.use('/material',require('./material'))


router.use('/port',
    require('./port'))

router.use('/order',require('./order'));

router.use('/report',require('./salesreport'))


router.use('/deals',
    require('./deals'));


router.use('/request',
    require('./slab_request'));

module.exports = router;