'use strict';
const
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  AmpedConnector = require('./AmpedConnector'),
  passport = require('passport'),
  User = require('../models/Users');

class AmpedPassport {

  constructor(app, socket) {
    this.app = app;
    this.addMiddleware();
    this.setup();
  }

  setup() {
    this.serialize();
    this.deserialize();
    this.setupStrategies();
    this.addRoutes();
  }

  addRoutes() {
    this.app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  }

  strategyCallbackHandler(req, res) {
    res.send(
      `<script>
                window.opener.location.href="/";
                self.close();
            </script>`
    );
  }

  serialize() {
    this.passport.serializeUser((user, done) => {
      done(null, user.id);
    });
  }

  deserialize() {
    this.passport.deserializeUser((req, id, done) => {
      // @TODO handle error
      console.log(req.db);
      req.db.users.findById(id)
        .then(function (user) {
          done(null, user);
        });
    });
  }

  setupStrategies() {
    this.googleStategy();
  }

  googleStategy() {

    // @TODO this is bad here. move this
    this.app.get('/auth/google', this.passport.authenticate('google', {scope: ['profile', 'email']}));
    this.app.get('/auth/google/callback',
      this.passport.authenticate('google'), this.strategyCallbackHandler);

    this.passport.use(new GoogleStrategy({
        // @TODO add config
        clientID: '900264263-3nqlusqgu014h4mb83vo39gdgt2orie4.apps.googleusercontent.com',
        clientSecret: '5BGqz2HWelkU0heJn2QQXMtn',
        callbackURL: '/auth/google/callback',
        passReqToCallback: true

      },
      (req, token, refreshToken, profile, done) => {

        console.log('Profile', profile);

        console.log(req.db.users  );
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {

          // try to find the user based on their google id
          // @TODO handle error
          req.db.users.findOne({'serviceId': profile.id, 'provider': 'google'})
          .then((user) => {
            console.log(user);

            if (user) {
              // if a user is found, log them in
              return done(null, user);
            } else {
              // if the user isnt in our database, create a new user

              const userObj = {
                service_id: profile.id,
                token: this.generateToken(128),
                display_name: profile.displayName,
                users_name: {
                  givenName: profile.name.givenName,
                  familyName: profile.name.familyName
                },
                emails: profile.emails.reduce((ret, val) => {
                  ret.push(val.value);
                  return ret;
                }, []),
                photos: profile.photos.reduce((ret, val) => {
                  ret.push(val.value.split('?')[0]);
                  return ret;
                }, []),
                provider: 'google',

              };

              userObj.photo = userObj.photos[0];
              userObj.email = userObj.emails[0];


              req.db.users.create(userObj)
                .then((user) => {
                  done(null, user);
                })
                .catch((err) => {
                    done(err); // @TODO handle error
                });
            }
          });
        });

      }));
  }

  addMiddleware() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(this.injectUser);
    // this.app.use(this.isLoggedIn);
  }

  generateToken(length){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 128; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  injectUser(req, res, next) {
    if (req.user) {
      const user = Object.assign({}, req.user);
      delete user.created_at;
      delete user.updated_at;
      delete user.serviceId;
      delete user._id;
      delete user.provider;
      user.type = 'user';
      res.locals.cleanUser = user;
    } else {
      res.locals.cleanUser = {type: 'guest'};
    }
    next();
  }

  static isLoggedIn(req, res, next) {
    // console.log(arguments);

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    // console.log('NOT LOGGED IN');
    // next();
    res.redirect('/');
  }

  get userModel() {
    return AmpedConnector.getModel('users');
  }

  get passport() {
    return passport;
  }

  static getPassport() {
    return passport;
  }
}

module.exports = AmpedPassport;
