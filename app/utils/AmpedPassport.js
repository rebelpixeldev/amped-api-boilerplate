'use strict';
const
  AmpedAuthorization  = require('./AmpedAuthorization'),
  AmpedConnector      = require('./AmpedConnector'),
  AmpedFeedback       = require('./AmpedFeedback'),
  bcrypt              = require('bcrypt'),
  config              = require('../config/config'),
  GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy,
  LocalStrategy       = require('passport-local').Strategy,
  JWT                 = require('jsonwebtoken'),
  passport            = require('passport'),
  passportJWT         = require('passport-jwt'),
  request             = require('request'),
  SHA1                = require('sha1'),
  User                = require('../models/Users'),
  util                = require('./AmpedUtil');

class AmpedPassport {

  constructor(app, socket) {
    this.app = app;
    this.addMiddleware();
    this.setup();
  }

  setup() {
    // this.serialize();
    // this.deserialize();
    this.setupStrategies();
    this.addRoutes();
  }

  addRoutes() {
    this.app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  }

  /**
   * The route callback used for all strategies other than LocalStrategy
   * @param req
   * @param res
   */
  strategyCallbackHandler(req, res) {
    res.send(
      `<script>
// console.log('${config.urls.site.domain}/login/${req.jwt}', JSON.parse(${JSON.stringify(config.urls)}));
            window.opener.location.href= '${config.urls.site.domain}/login/${req.jwt}';
            self.close();
            // window.opener.onLogin({response : { token : '${req.jwt}' }});
            //     window.opener.location.href="http://";
            //     self.close();
            </script>`
    );
  }

  // serialize() {
  //   this.passport.serializeUser((user, done) => {
  //     done(null, user.id);
  //   });
  // }
  //
  // deserialize() {
  //   this.passport.deserializeUser((req, id, done) => {
  //     // @TODO handle error
  //     req.db.users.findById(id)
  //       .then(function (user) {
  //         done(null, user);
  //       });
  //   });
  // }

  setupStrategies() {
    this.googleStategy();
    this.localStrategy();
    this.jwt();
  }

  jwt() {
    const opts = {
      jwtFromRequest: passportJWT.ExtractJwt.fromHeader('authorization'),
      secretOrKey: config.jwt.secret,
      issuer: config.jwt.issuer,
      ignoreExpiration: true
    };

    passport.use(new passportJWT.Strategy(opts, (payload, done) => {
      done(null, payload)
    }));
  }

  localStrategy() {

    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done) => {
      req.db.users.findOne({where: {email}})
        .then((user) => {
          done(null, user);
        }).catch(err);
    }));

    console.log('SETTING UP LOCAL');

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req, email, password, done) => {

      console.log('HERRRE');

        const params = util.getParams(req);

        console.log(params);

        req.db.users.findOne({where: {email: email}})
          .then((user) => {

            if (user) {
              const feedback = new AmpedFeedback({sendResponse : false});
                done(null, user.provider === 'local' ? 'This email already exists' : `This email has been logged in with ${util.capitalize(user.provider)}`);

            } else {
              const userObj = {
                display_name: params.first_name,
                users_name: {
                  givenName: params.first_name,
                  familyName: params.last_name
                },
                email,
                upload_id: 0,
                account: 0,
                provider: 'local',
              };

              // bcrypt.hash(password, 10)
              //   .then((hash) => {
              userObj.password = util.encodePassword(password);

              req.db.users.create(userObj)
                .then((user) => {
                  return user;
                })
                .then((user) => {
                  this.createUserAccount(req, user)
                    .then((user) => {
                      req.jwt = AmpedAuthorization.encodeToken(user);
                      req.user = user.dataValues;
                      done(null, user)
                    })
                    .catch(done);
                })
              // .then((user) => {
              //   done(null, user);
              // })
              // .catch((err) => {
              //   console.log('User create errpr');
              //   done(err); // @TODO handle error
              // });


              // })

            }
          })
      }));
  }


  googleStategy() {
    this.app.get('/auth/google', this.passport.authenticate('google', {scope: ['profile', 'email']}));
    this.app.get('/auth/google/callback',
      this.passport.authenticate('google', {session:false}), this.strategyCallbackHandler);
    this.passport.use(new GoogleStrategy(config.passport.google,
      (req, token, refreshToken, profile, done) => {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {

          // try to find the user based on their google id
          req.db.users.findOne({where: {service_id : profile.id, provider : 'google'}})
            .then((user) => {
              console.log(user);

              if (user) {
                req.jwt = AmpedAuthorization.encodeToken(user);
                // if a user is found, log them in
                return done(null, user);
              } else {

                /**
                 * Create user flow
                 * @TODO This can proabaly be cleaned up quite a bit
                 * @TODO account for invited accounts. Decide whether the user still gets an account or they are just added to the invited account
                 *
                 * create user with the account and photo ids of 0
                 * create an account with the users name as the name of the account
                 * update account id on the user
                 * Call the uploads service and download their profile picture
                 * update the photo id on the user
                 */
                const userObj = {
                  service_id: profile.id,
                  token: this.generateToken(64),
                  display_name: profile.displayName,
                  users_name: {
                    givenName: profile.name.givenName,
                    familyName: profile.name.familyName
                  },
                  emails: profile.emails.reduce((ret, val) => {
                    ret.push(val.value);
                    return ret;
                  }, []),
                  upload_id: 0,
                  account: 0,
                  provider: 'google',

                };

                // userObj.photo = userObj.photos[0];
                userObj.email = userObj.emails[0];

                req.db.users.create(userObj)
                  .then(this.createUserAccount.bind(this, req))
                  .then((user) => {
                    request({
                      url: `${config.urls.api}/uploads/upload?remote_url=${profile.upload_id[0].value.split('?')[0]}&token=${user.token}`,
                      method: 'POST'
                    }, (err, resp, body) => {
                      // Ignore if the file upload is false since there is a backup avatar
                      const
                        fileResp = JSON.parse(body),
                        fileInfo = fileResp.response;

                      user.updateAttributes({
                        upload_id: fileInfo.id
                      }).then(() => {
                        req.jwt = AmpedAuthorization.encodeToken(user);
                        done(err, user)
                      });
                    })
                  })
                  .catch(done);
              }
            }).catch(done);
        });

      }));
  }

  // @TODO error handling
  createUserAccount(req, user) {
    return new Promise((resolve, reject) => {
      req.db.accounts.create({
        name: user.displayName
      }).then((account) => {

        user.updateAttributes({
          account_id: account.id
        }).then(() => {
          // @TODO will error out, the GET route has been replaced with POST
          resolve(user);
        })
      })
    })
  }

  addMiddleware() {
    this.app.use(passport.initialize());
    this.app.use((req, res, next) => {

      console.log(config.routing.isPublic(req.url),typeof req.header.authorizaion !== 'undefined' );
// gets stuck here on login

      if ( config.routing.isPublic(req.url) ) return next();
      passport.authenticate('jwt', {session: false}, (err, user, info) => {
console.log('HAY', err, user);
console.log(req.url);
        if (err) return next(err);
        // @TODO This is shit. It is here because the code will exit here and not run the rest fo the code when you are logging in
        else if (req.url === '/api/user/login') next();
        else if (!user) return res.feedback({success: false, message : info.toString()});
        req.payload = user;
        next();
      })(req, res, next);
    })
    // this.app.use(passport.session());
    this.app.use(this.injectUser);
    // this.app.use(this.isLoggedIn);
  }

  generateToken(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 128; i++)
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

  get jwtOpts() {
    return {
      secretOrKey: 'secret',
      issuer: config.jwt.issuer
    };
  }

  static getPassport() {
    return passport;
  }
}

module.exports = AmpedPassport;
