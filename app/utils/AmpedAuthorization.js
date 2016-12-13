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

  login(req, res){
    const params = util.getParams(req);

    return new Promise((resolve, reject) => {

      req.db.users.findOne({where:{email:params.email}})
        .then((user) => {

          // @TODO verifications for users email

          console.log(params.password, user.password, config.bcrypt.saltRounds);

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

  static encodeToken(user){
    return JWT.sign({
        id : user.id,
        email : user.email
      }, config.jwt.secret , { expiresIn : config.jwt.expires, issuer : config.jwt.issuer })
  }

  static decodeToken(jwt){
    return new Promise((resolve, reject) => {
      console.log('DECODING');
      JWT.decode(config.jwt.secret, jwt, (err, decode) => {
        console.log(err);
        resolve(decode);
      })
    })

  }



  setUserByToken(req, res, next) {
    // if ( req.user )
    //   return req.user;
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

  static getUserByToken(req, token, callback) {
    // @TODO do something on catch

    // AmpedAuthorization.decodeToken(token)
    //   .then((info) => {
        if ( config.routing.noAuth.indexOf(req.url) !== -1 || typeof req.payload === 'undefined' || req.payload.id === ''|| parseInt(req.payload.id) === '' )
          return callback(null);

        req.dbRef.users.getModel().findOne({where: {id: parseInt(req.payload.id)}, include: req.dbRef.users.queryIncludes, raw: true})
          .then(user => AmpedAuthorization.convertQueryRelations(user))
          .then((user) => {
            // @TODO re-evaluate if this can be done in a sequelize join or this is alright
              req.db.uploads.findOne({where: {id: parseInt(user.photo) /* === '' ? 0 : user.photo)*/ }, raw: true})
                .then((photo) => {
                  if ( photo !== null ) {
                    user.photo = photo;
                    user.photo.source_path = `/uploads/source/${user.photo.id}.${user.photo.extension}`;
                    user.photo.source_url = `http://localhost:3000/uploads/source/${user.photo.id}.${user.photo.extension}`;
                  }
                  callback(user);
                })
        })
  }

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

module.exports.AmpedAuthorization = AmpedAuthorization;
module.exports.encodeToken = AmpedAuthorization.encodeToken;

module.exports.getUserByToken = AmpedAuthorization.getUserByToken;
module.exports.convertQueryRelations = AmpedAuthorization.convertQueryRelations;

module.exports.middleware = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.setUserByToken;

}
