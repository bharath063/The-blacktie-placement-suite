var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');

 var configDB = require('./config/database.js');

// // configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

var User = require('./models/user');
require('./config/passportJWT');

//routes
// var routes = require('./routes/index');
// var users = require('./routes/users');
// var login = require('./routes/login');
// var dashboard = require('./routes/dashboard');
//var api = require('./routes/api');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'a big secret', name: 'session_id', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport);
// require('./routes/routes.js');

// Don't forget to authenticate user
// app.use('/api', api);


/* The below routes are outdated and do not use passport */

// app.use('/', routes);
// app.use('/users', users);
// app.use('/login', login);
// app.use('/dashboard', dashboard);














// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});






// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
