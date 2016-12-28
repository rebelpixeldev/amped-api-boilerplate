'use strict';


const
  SHA1    = require('sha1'),
  config  = require('../config/config'),
  JWT     = require('jsonwebtoken'),
  util    = require('./AmpedUtil');

// @TODO make external npm module
const url = require('url');

class AmpedAuthorization {

  constructor(params) {
    this._params = params;
  }

  /**
   * The login route for the system when the user wants to login through a local strategy
   *
   * @param {object} req     - Express request object
   * @param {object} res     - Express response object
   */
  login(req, res){
    const params = util.getParams(req);

    return new Promise((resolve, reject) => {

      req.db.users.findOne({where:{email:params.email}})
        .then((user) => {

          // @TODO verifications for users email
          if ( SHA1(params.password) === user.password ){
            // @TODO make it so that we gather more info on login with a helper lib AmpedUserInfo or something
            resolve({
              token: AmpedAuthorization.encodeToken(user)
            })
          } else {
            reject(config.errors.getError('incorrect-password'))
          }

        }).catch((err) => {
            console.log('ERR');
        console.log(err);
        })

    })
  }

  /**
   * Creates a signed JWT token for the system to authenticate the user with in all api requests.
   *
   * @param {object} user - An object with all the current users data in it
   *
   * @returns {string} - A JWT signed token
   */
  static encodeToken(user){
    return JWT.sign({
        id : user.id,
        email : user.email
      }, config.jwt.secret , { expiresIn : config.jwt.expires, issuer : config.jwt.issuer })
  }

  /**
   * Decodes the user token and returns the payload
   *
   * @param {string} jwt   - A signed JWT token which the payload needs to be fetched from
   *
   * @returns {Promise}   - A Promise which when resolves has the payload as its parameter.
   */
  static decodeToken(jwt){
    return new Promise((resolve, reject) => {
      JWT.decode(config.jwt.secret, jwt, (err, decode) => {
        if ( err ) reject(err);
        else resolve(decode);
      })
    })

  }

  /**
   * Sets the user in the req object by using the authorization header in the call.
   * Should be called through `app.use` so the user is automatically attached to every request
   *
   * @param {object} req      - Express request object
   * @param {object} res      - Express response object
   * @param {function} next   - Express missleware callback
   */
  setUserByToken(req, res, next) {
    const query = url.parse(req.url, true).query;
    if (typeof req.headers.authorization !== 'undefined') {
      AmpedAuthorization.getUserByToken.call(this, req, req.headers.authorization, (user) => {
        req.user = user;
        next();
      })
    } else {
      req.user = null;
      next()
    }

  }

  /**
   * @TODO Named a little incorrect (probably was suppose to do something else when it was created)
   * @TODO do something on catch
   * @TODO should probably return a promise. Might work a little nicer
   *
   * A static call to build the user object by `req.payload` and fetching the data through the database
   *
   * @param {object} req          - Express request object
   * @param {function} callback   - A callback called when the user data has been fetched or null if the payload is empty or set to an empty string
   */
  static getUserByToken(req, callback) {
        if ( config.routing.noAuth.indexOf(req.url) !== -1 || typeof req.payload === 'undefined' || req.payload.id === ''|| parseInt(req.payload.id) === '' )
          callback(null);

        req.dbRef.users.getModel().findOne({where: {id: parseInt(req.payload.id)}, include: req.dbRef.users.queryIncludes})
          .then(callback);
  }

  /**
   * Converts a string with a decimal to an object.
   *
   * 'foo.bar' = 'sup' -> { foo : { bar : 'sup' } }
   *
   * @param {object} data - An object which should be searched through to conver the data types
   *
   * @returns {object}    - A convert object
   */
  static convertQueryRelations(data) {
     return Object.keys(data).reduce((ret, key) => {
      if (key.indexOf('.') !== -1 ) {
        const parts = key.split('.');
        if ( typeof ret[parts[0]] === 'undefined')
          ret[parts[0]] = {};
        ret[parts[0]][parts[1]] = data[key];
      } else {
        ret[key] = data[key];
      }
      return ret;
    }, {});
  }
}


// Export AmpedAuthorization as the class to create new instances of
module.exports.AmpedAuthorization = AmpedAuthorization;

// Export all of the static functions for convenience
module.exports.encodeToken = AmpedAuthorization.encodeToken;
module.exports.getUserByToken = AmpedAuthorization.getUserByToken;
module.exports.convertQueryRelations = AmpedAuthorization.convertQueryRelations;

// Export the middleware for each request
module.exports.middleware = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.setUserByToken;

}
