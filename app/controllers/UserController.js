'use strict';

const
  AmpedPassport = require('../utils/AmpedPassport'),
  passport = require('passport'),
  User = require('../models/Users');

class UserController {

  constructor(app, socket) {
    this.app = app;
    this.model = new User(app, socket);
  }

  setupRoutes() {
    this.app.get('/login', this.home.bind(this));
    this.app.get('/profile', AmpedPassport.isLoggedIn, this.profile.bind(this));

  }

  home(req, res) {
    res.render('index');
  }


  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
