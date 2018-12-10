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

require('./config/passport.js')(passport);
var mongoose = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())


app.use('/', indexRouter);
app.use('/customer/', usersRouter);
app.use('/supplier/', supplierRouter);
app.use('/admin/confirmuser',adminRegisterConfirmationRouter);
app.use('/admin',adminRouter);


mongoose.connect('mongodb://localhost:27017/SlabTrade', function(err,db) {
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
