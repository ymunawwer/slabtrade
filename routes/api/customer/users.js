var express = require('express');
var router = express.Router();
var passport = require('passport')
var user = require('../../../models/user');
var jwt = require('jsonwebtoken');
var auth = require('../../../middlewares/auth');
var products = require('../../../models/products');
var customerController = require('../../../controllers/customers/search');
var loginCtrl = require('../../../controllers/customers/login');
var registerCtrl = require('../../../controllers/customers/register');
const cartCtrl = require('../../../controllers/customers/cart');
const mail = require('../../../services/mailService');
const orderCtrl = require('../../../controllers/customers/order');
const orderService = require('../../../services/order')
const portService = require('../../../services/port');
const requestslabCtrl = require('../../../controllers/customers/requestslab')
const cartnewCtrl = require('../../../controllers/customers/cartnew');
const wishlistCtrl = require('../../../controllers/customers/wishlist')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/login',loginCtrl.login);


router.post('/register',registerCtrl.register);
 


router.get('/searchproductwithprice',auth.checkToken,customerController.searchQuerywithprice);

router.get('/firstpageproductlistwithprice',auth.checkToken,customerController.firstPageProductwithprice);

router.get('/searchproduct',customerController.searchQuery);

router.get('/firstpageproductlist',customerController.firstPageProduct);

//tomorrow


router.get('/removecartitem',auth.checkToken,cartCtrl.removeBundle)
router.post('/deletecart',auth.checkToken,cartCtrl.deleteAllItemFromCart);

router.post('/sendMail',mail.sendMail)

router.get('/searchbycity',customerController.searchByCity)



router.get('/searchbycitywithoutprice',customerController.searchByCityWithoutPrice)

//searchByRecentlyCreated searchByDealsWithoutPrice
router.get('/recentlycreated',customerController.searchByRecentlyCreated)

router.get('/recentlycreatedwithoutprice',customerController.searchByRecentlyCreatedwithoutPrice)

router.get('/getdeals',customerController.searchByDeals)

router.get('/getdealswithoutprice',customerController.searchByDealsWithoutPrice)

router.get('/mostviewed',customerController.mostviewed)


router.get('/mostviewedwithoutprice',customerController.mostViewedWithoutPrice)

router.post('/addtocart',auth.checkToken,cartCtrl.addToCart); //same api to create and update cart item

// router.post('/addtocart',auth.checkToken,cartnewCtrl.addToCart);

router.get('/shippingdownload',orderService.getShippingDoc);

router.post('/recalculate',auth.checkToken,cartCtrl.itemRemove)

router.get('/cart',auth.checkToken,cartCtrl.allItemInCart);

router.post('/checkout',orderCtrl.checkOut);

router.post('/orderstatus',auth.checkToken,orderService.orderStatus)

router.get('/getport',portService.getPortDetail)

router.get('/getportbycountry',portService.getPortDetailByCountry)

router.get('/test',function(req,res,next){
  const x = auth.checkToken(req,res,next);
  console.log(req.user);
});

router.get('/allorder',auth.checkToken,orderService.getallOrderByCustomer)

router.get('/getsimilarproduct',customerController.getAllProduct);

router.get('/getorder',auth.checkToken,orderService.getOrderDetail);
router.post('/createrequest',requestslabCtrl.create_request);

router.get('/containerbyid',auth.checkToken,cartCtrl.getCartItemByContainerId);
router.get('/removecontainerbyid',auth.checkToken,cartCtrl.removeContainer);
router.get('/removebundlebyid',auth.checkToken,cartCtrl.removeBundle);

router.get('/wishlist',auth.checkToken,wishlistCtrl.addToFav);
router.get('/removefromwishlist',auth.checkToken,wishlistCtrl.removeFromFav);


module.exports = router;
