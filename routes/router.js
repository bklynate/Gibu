const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', function(request, response) {
  response.render('index');
})

router.get('/signup', function(request, response) {
  response.render('signup');
})

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
