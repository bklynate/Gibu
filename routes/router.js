const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');

router.get('/', function(request, response) {
  response.render('index');
})

router.post('/authenticate', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

router.get('/login', function(request, response) {
  response.render('login');
})

router.get("/logout", function(request, response){
  request.logout();
  request.flash("success", "Successfully logged out");
  response.redirect("/");
});

router.get('/signup', function(request, response) {
  response.render('signup');
});

router.get('/dashboard', function(request, response) {
  response.render('/dashboard', {user: request.user})
});

router.post('/signup', function(request, response) {
  db.User.find({where: {username: request.username}}).then(function(user) {
    if (!user) {
      db.User.create({username: request.body.username, password: request.body.password}).then(function(user) {
        request.logIn(user, function(err) {
          if (err) {
            return response.redirect('/signup');
          } else {
            response.redirect('/');
          }
        });
      }).catch(function(err) {
        console.log('Hello');
      });
    }
  });
});

module.exports = router;
