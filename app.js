
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/customer/users');
var supplierRouter = require('./routes/api/supplier/users')
var adminRegisterConfirmationRouter = require('./routes/api/admin/customer_supplier');
var adminRouter = require('./routes/api/admin/user');var adminRouter = require('./routes/api/admin/index');
var cors = require('cors')
require('./config/passport.js')(passport);
var mongoose = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.use(cors())

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header()

//   next();
// });

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Auth,Accept,Origin, X-Requested-With,role');
 
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    console.log("demo")
    res.sendStatus(200);
  } else {
    next();
  }
 };

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/products/')));
app.use(passport.initialize())


app.use('/', indexRouter);
app.use('/customer/', usersRouter);
app.use('/supplier/',supplierRouter);
app.use('/admin/confirmuser',adminRegisterConfirmationRouter);
app.use('/admin',cors(),adminRouter);


mongoose.connect('mongodb://18.224.109.243:27017/SlabTrade', function(err,db) {
// mongoose.connect('mongodb://slabTradeUser:slab_cool_trade@18.224.109.243:27017/SlabTrade', function(err,db) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
