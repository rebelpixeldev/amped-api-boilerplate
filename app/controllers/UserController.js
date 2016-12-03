'use strict';

const
  AmpedPassport = require('../utils/AmpedPassport'),
  AmpedAuth     = require('../utils/AmpedAuthorization'),
  passport      = require('passport'),
  User          = require('../models/Users');

class UserController {

  constructor(app, socket) {
    this.app = app;
  }

  setupRoutes() {
    this.app.get('/login', this.home.bind(this));
    this.app.get('/profile', AmpedPassport.isLoggedIn, this.profile.bind(this));

    this.app.get('/user', this.getUser.bind(this));

  }

  home(req, res) {
    res.render('index');
  }

  getUser(req, res){
    if ( typeof req.user !== 'undefined' && typeof req.user.token !== 'undefined' )
      AmpedAuth.getUserByToken(req, req.user.token, res.feedback);
    else
      res.feedback(false);
  }

  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
