'use strict';

const
  AmpedPassport = require('../utils/AmpedPassport'),
  AmpedAuth     = require('../utils/AmpedAuthorization'),
  passport      = require('passport'),
  User          = require('../models/Users');

class UserController {

  constructor(app, socket) {
    this.app = app;
    // @TODO don't liek the naming here
    this.auth = new AmpedAuth.AmpedAuthorization();
  }

  setupRoutes() {

    this.app.get('/user', this.getUser.bind(this));

    // this.app.route('/login')
    //   // .get(this.home.bind(this))
    //   .post(passport.authenticate('local-login', {
    //     session : false,
    //     failureFlash : true // allow flash messages
    //   }), ( req, res ) => res.feedback());

    this.app.post('/login', (req, res) => {
      this.auth.login(req)
        .then(data => {
          req.logActivity('login', 'User logged in', {
            ip  :req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
          }, user.get({raw:true}));
          res.feedback(data);
        })
    });


    this.app.post('/register', passport.authenticate('local-signup', {
      session : false
    }), ( req, res ) => res.feedback(true));

    this.app.get('/profile', AmpedPassport.isLoggedIn, this.profile.bind(this));

  }

  home(req, res) {
    res.render('index');
  }

  getUser(req, res){
      res.feedback(req.user);
  }

  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
