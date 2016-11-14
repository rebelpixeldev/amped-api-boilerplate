'use strict';

const
  AmpedPassport = require('../utils/AmpedPassport'),
  passport = require('passport'),
  User = require('../models/Users');

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
    res.feedback(req.user || {});
  }

  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
