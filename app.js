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

var User = require('./models/user');
require('./config/passportJWT');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


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


var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });



app.use(upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]));





require('./routes/routes.js')(app, passport);


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
