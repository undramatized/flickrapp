var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/passportConfig');
var routes = require('./routes/index');
var expressLayouts = require('express-ejs-layouts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//express-layouts setup
app.use(expressLayouts);
app.set('layout', 'layout');

//static folder setup
app.use(express.static(__dirname + '/public/'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || "random",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // before every route, current user to res.locals
  res.locals.currentUser = req.user;
  next();
});

app.use('/', routes);

app.listen(process.env.PORT || 3100);

module.exports = app;
