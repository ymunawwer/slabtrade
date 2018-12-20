var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../../../models/user');
var bundleUpdate = require('../../../middlewares/upload');
var jwt = require('jsonwebtoken');
var registerCtrl = require('../../../controllers/supplier/register');
var manageProduct = require('../../../controllers/supplier/manageproduct');
var managecsv = require('../../../controllers/supplier/managecsv');
const orderService = require('../../../services/order');
const auth = require('../../../middlewares/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




router.post('/login',function(req,res,next){
  passport.authenticate('local-login', {session: false,failureRedirect: '/login'}, function(err, user, info){
    if(err){
      return res.status(400).json({
        "message":"Invalid input",
        "user":user
      })
    }
      req.login(user, {session: true}, (err) => {
        if (err) {
            res.send(err);
        }
    if(user){
    const token = jwt.sign(user, 'your_jwt_secret');
    res.header('Auth', token).redirect('/');
    // return res.json({user, token});
    }else{
      res.redirect('/login');
    }
    
 });
})(req, res);
  
})


router.post('/register',registerCtrl.register);



router.post('/upload',bundleUpdate.upload.array('image',5),manageProduct.addProduct);



router.get('/removeproduct',auth.checkToken,manageProduct.removeProduct);



router.post('/update',auth.checkToken,manageProduct.updateProduct);

router.post('/uploadshippingdetail',bundleUpdate.shipment_upload.array('shipping_file',7),manageProduct.uploadShippingDetail)


router.get('/getallproduct',auth.checkToken,manageProduct.getAllProduct);
router.get('/getallorder',auth.checkToken,orderService.getallorderBySupplier);
router.get('/csvdownload',managecsv.downloadCsv);//,auth.checkToken
router.post('/uploadBulkProduct',bundleUpdate.bulk_update.array('product_csv',1),managecsv.uploadCsv);

router.post('/orderstatus',auth.checkToken,orderService.orderStatus);
router.get('/getcustomer',auth.checkToken,registerCtrl.getUserName);
router.get('/gerorder',auth.checkToken,orderService.getOrderDetail);

module.exports = router;
