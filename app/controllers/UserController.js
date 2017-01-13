'use strict';

const
  AmpedAuth     = require('../utils/AmpedAuthorization'),
  AmpedEmailer  = require('../utils/AmpedEmailer'),
  AmpedPassport = require('../utils/AmpedPassport'),
  config        = require('../config/config'),
  passport      = require('passport'),
  User          = require('../models/Users'),
  util          = require('../utils/AmpedUtil');

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

    this.app.post('/user/invite', AmpedPassport.isLoggedIn, this.userInvite.bind(this));

  }

  home(req, res) {
    res.render('index');
  }

  getUser(req, res){
      res.feedback(req.user);
  }


  // @TODO parameter checking
  // @TODO probably will need to save the token in the database for extra validity
  // @TODO add the user into the database and mark their status as invitation sent or some shit like that
  userInvite(req, res){
    const
      params = util.getParams(req),
      emailer = new AmpedEmailer('user-invite'),
      jwtPayload = {
        email : params.email,
        name : params.name,
        id : req.user.id,
        dest_account : req.user.account.id
      };

    emailer.send(req, {
      content_greeting : 'Hey, ',
      content_name : `${params.name}!`,
      content_description : `
          <p>${req.user.display_name} is inviting you to their ${req.user.account.name} account on 
          Amped Admin account. To accept click the link below. If you are already an Amped Admin user, 
          the account will automatically be added. If you are not, signup only takes a minute!</p>
          <p><strong>The link will expire in 4 hours</strong></p>
          `,
      content_button_href : `${config.urls.site.domain}/user/invite-accept?token=${encodeURIComponent(util.generateJWT(jwtPayload, config.email.jwt))}`,
      content_button_label : `Get access now!`
    }, `Invite to ${config.site.name}`)
      .then(() => {
        res.feedback({message:'Your invtation has been sent'});
      })
      .catch((message) => {
          res.feedback({success:false, message})
      })

  }

  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
