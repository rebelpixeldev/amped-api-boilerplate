'use strict';
const

  AmpedConnector = require('./AmpedConnector'),
  bcrypt = require('bcrypt'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  LocalStrategy = require('passport-local').Strategy,
  passport = require('passport'),
  request = require('request'),
  User = require('../models/Users'),
  util = require('./AmpedUtil');

// @TODO move to config
const salt = 'saltymcsalt';

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
      req.db.users.findById(id)
        .then(function (user) {
          done(null, user);
        });
    });
  }

  setupStrategies() {
    this.googleStategy();
    this.localStrategy();
  }

  localStrategy() {
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req, email, password, done) => {

        console.log('YAY');

        const params = util.getParams(req);

        console.log(email);

        req.db.users.findOne({where: {email : email}})
          .then((user) => {

            // if (user) {
            //   // @TODO user exists, send message back
            //   // @TODO take into account email with a different strategy
            //   console.log('USER EXISTS');
            //   done('user exists', null);
            // } else {
              const userObj = {
                display_name: params.first_name,
                users_name: {
                  givenName: params.first_name,
                  familyName: params.last_name
                },
                email,
                photo: 0,
                account: 0,
                provider: 'local',
              };

              bcrypt.hash(password, 10)
                .then((hash) => {
                  console.log(hash);
                  userObj.password = hash;

                  req.db.users.create(userObj)
                    .then((user) => {
                      console.log('USER CREATED');
                        return user;
                    })
                    .then((user) => {
                      this.createUserAccount(req, user)
                        .then((user) => {
                          req.login(user, () => done(null, user));
                        })
                        .catch((err) => {
                          console.log('User create errpr');
                          done(err); // @TODO handle error
                        });
                    })
                    // .then((user) => {
                    //   done(null, user);
                    // })
                    // .catch((err) => {
                    //   console.log('User create errpr');
                    //   done(err); // @TODO handle error
                    // });




                })

            // }
          })
      }));
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

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {

          // try to find the user based on their google id
          // @TODO handle error
          req.db.users.findOne({'serviceId': profile.id, 'provider': 'google'})
            .then((user) => {

              if (user) {
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
                  photo: 0,
                  account: 0,
                  provider: 'google',

                };

                // userObj.photo = userObj.photos[0];
                userObj.email = userObj.emails[0];

                req.db.users.create(userObj)
                  .then(this.createUserAccount.bind(this, req))
                  .then((user) => {
                    request({
                      url: `http://localhost:3000/uploads/upload?remote_url=${profile.photos[0].value.split('?')[0]}&token=${user.token}`,
                      method: 'POST'
                    }, (err, resp, body) => {
                      // @TODO catch if success is false
                      const fileInfo = JSON.parse(body).response;

                      user.updateAttributes({
                        photo: fileInfo.id
                      }).then(() => done(err, user));
                    })
                  })
                  .catch((err) => {
                    done(err); // @TODO handle error
                  });
              }
            });
        });

      }));
  }

  // @TODO error handling
  createUserAccount(req, user){
    console.log('creating account');
    return new Promise((resolve, reject) => {
      console.log(user.displayName);
      req.db.accounts.create({
        name: user.displayName
      }).then((account) => {

        user.updateAttributes({
          account_id: account.id
        }).then(() => {
          // @TODO url should come from config
          // @TODO will error out, the GET route has been replaced with POST
          resolve(user);
        })
      })
    })
  }

  addMiddleware() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
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

  static getPassport() {
    return passport;
  }
}

module.exports = AmpedPassport;
