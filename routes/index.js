var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/passportConfig');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PhotoCatch' });
});

router.get('/signup', function(req, res){
  res.render('signup');
});

router.post('/signup', function(req, res) {
  // find or create a user, providing the name and password as default values
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      // if created, success and redirect home
      console.log('User created!');
      passport.authenticate('local', {
        successRedirect: '/'
      })(req, res);
    } else {
      // if not created, the email already exists
      console.log('Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    // if an error occurs, let's see what the error is
    console.log('An error occurred: ', error.message);
    res.redirect('/auth/signup');
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

module.exports = router;
