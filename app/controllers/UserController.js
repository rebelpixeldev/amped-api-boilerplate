'use strict';

const
  AmpedAuth     = require('../utils/AmpedAuthorization'),
  AmpedEmailer  = require('../utils/AmpedEmailer'),
  AmpedPassport = require('../utils/AmpedPassport'),
  bcrypt        = require('bcrypt'),
  config        = require('../config/config'),
  passport      = require('passport'),
  SHA1          = require('sha1'),
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
    this.app.get('/user/invite-accept', this.userInviteAccept.bind(this));
    this.app.post('/resetpassword', this.resetPassword.bind(this));
    this.app.post('/setpassword', this.setPassword.bind(this));
    this.app.post('/login', this.login.bind(this));

    this.app.post('/register', passport.authenticate('local-signup', {  session : false }), this.register.bind(this));

    this.app.get('/profile', AmpedPassport.isLoggedIn, this.profile.bind(this));
    this.app.post('/user/invite', AmpedPassport.isLoggedIn, this.userInvite.bind(this));





  }

  home(req, res) {
    res.render('index');
  }

  getUser(req, res){
      res.feedback(req.user);
  }

  login(req, res){
    this.auth.login(req)
      .then(data => {
        req.logActivity('login', 'User logged in', {
          ip  :req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
        }, user.get({raw:true}));
        res.feedback(data);
      })
  }

  register(req, res){

    new AmpedEmailer('welcome').send(req, {
      content_name : `${req.user.display_name}!`,
      content_description : `
          <p>Welcome to ${config.site.name}! Click the link below and take a look around</p>
          `,
      content_button_href : `${config.urls.site.domain}`,
      content_button_label : `Get access now!`
    }, `Welcome to ${config.site.name}`)
      .then(() => {
        res.feedback(AmpedAuth.encodeToken(req.user));
      })
      .catch(res.feedbackError);
  }


  // @TODO parameter checking
  // @TODO probably will need to save the token in the database for extra validity
  // @TODO add the user into the database and mark their status as invitation sent or some shit like that
  userInvite(req, res){
    const
      params = req.amped.params,
      jwtPayload = {
        email : params.email,
        name : params.name,
        id : req.user.id,
        dest_account : req.user.account.id
      };

    new AmpedEmailer('user-invite').send(req, {
      content_greeting : 'Hey, ',
      content_name : `${params.name}!`,
      content_description : `
          <p>${req.user.display_name} is inviting you to their ${req.user.account.name} account on 
          Amped Admin account. To accept click the link below. If you are already an Amped Admin user, 
          the account will automatically be added. If you are not, signup only takes a minute!</p>
          <p><strong>The link self destruct in 4 hours</strong></p>
          `,
      content_button_href : `${config.urls.site.domain}/user/invite-accept?token=${encodeURIComponent(util.generateJWT(jwtPayload, config.email.jwt))}`,
      content_button_label : `Get access now!`
    }, `Invite to ${config.site.name}`)
      .then(() => {
        res.feedbackSuccess('Your invtation has been sent');
      })
      .catch(res.feedbackError)

  }

  resetPassword(req, res){
    req.db.users.findOne({where: { email : req.amped.params.email }})
      .then((user) => {

        if ( user === null ) {
          res.feedback({success: false, message: 'That user does not exist.'})
        }else if ( user.provider !== 'local'){
          res.feedback({success: false, message: `That email was logged in through ${util.capitalize(user.provider)}`})
        } else {


          new AmpedEmailer('cta-text').send(req, {
            content_greeting : 'Hey, ',
            content_name : `${user.display_name}!`,
            content_description : `
          <p>Click the link below to reset your password</p>
          <p><strong>The link self destruct in 4 hours</strong></p>
          `,
            content_button_href : `${config.urls.site.domain}/#/setpassword?token=${encodeURIComponent(util.generateJWT({ id : user.id }, config.email.jwt))}`,
            content_button_label : `Reset`
          }, `${config.site.name} password reset`)
            .then(() => {
              res.feedbackSuccess(`Password reset instructions have been sent to ${user.email}`);
            })
            .catch(res.feedbackError)
        }


      })
  }

  setPassword(req, res){
    if ( req.amped.params.new_password !== req.amped.params.new_password_again ){
      res.feedback({success : false, message : 'The passwords do not match'});
      return false;
    }

    const payload = util.decodeJWT(req.amped.params.token);

    req.db.users.findOne({where : { id : payload.id }})
      .then((user) => {
          if ( user === null )
            res.feedback({success:false, message : 'That token is invalid'});
          else {
            user.updateAttributes({
              password : util.encodePassword(req.amped.params.new_password)
            }).then(() => {
                res.feedback(AmpedAuth.encodeToken(user))
            })
          }
      })


  }

  userInviteAccept(req, res){
    const params = util.getParams(req),
      payload = util.decodeJWT(params.token, config.email.jwt.secret);

    res.json(payload);
  }

  profile(req, res) {
    res.render('profile', {
      user: req.user
    })
  }
}

module.exports = UserController;
