const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');
const middleware = require('../config/middleware');

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

router.get('/dashboard', middleware.authenticated, function(request, response) {
  db.User.findAll({
    include: [{
      model: db.Project
    }]
  }).then(function(projects) {
    console.log('---------------------', projects)
    response.render('dashboard', {user: request.user,
                                  projects});
  })
});

router.get('/newcampaign', middleware.authenticated, function(request, response) {
  response.render('newcampaign');
});

router.post('/newcampaign', middleware.authenticated, function(request, response) {
  console.log("-------", request.campaignTitle);
  db.Project.find({where: {name: request.campaignTitle}}).then(function(project) {
    if (!project) {
      db.Project.create({name: request.body.campaignTitle, imageUrl: request.body.imageUrl, description: request.body.description}).then(function(campaign){
        response.render('campaign', {campaign})
      })
      .catch(function(err) {
        request.flash('error message:', err.message)
        return response.redirect('/dashboard');
      });
    }
  })
});

router.get('/:id', middleware.authenticated, function(request, response) {
  let id = request.params.id;
  db.Project.findById(id).then(function(project){
    if(!project) {
      response.send('<h1>NOT FOUND</h1>')
    } else {
      return response.render('campaign', {campaign:project})
    }
  })
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
        console.log('ran in here CATCH ONE')
        request.flash('error message:', err.message)
        return response.redirect('/signup');
      });
    }
  });
});

module.exports = router;
