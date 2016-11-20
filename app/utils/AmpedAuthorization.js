'use strict';
// @TODO make external npm module
const url = require('url');

class AmpedAuthorization{

  constructor(params){
    this._params = params;
  }

  setUserByToken(req, res, next){
    // if ( req.user )
    //   return req.user;

    const query = url.parse(req.url, true).query;

    if ( typeof query.token !== 'undefined' ) {
      AmpedAuthorization.getUserByToken(req, query.token, (user) => {
        req.user = user;
        req.user.account = user.account.dataValues;
        next();
      })
    } else
      next()

  }

  static getUserByToken(req, token, callback){
    // @TODO do something on catch
    req.dbRef.users.getModel().findOne({where: {token: token }, include : req.dbRef.users.queryIncludes})
      .then((user) => {
        // @TODO re-evaluate if this can be done in a sequelize join or this is alright
          req.db.uploads.findOne({where: {id:user.photo}})
            .then((photo) => {
                user = user.dataValues;
                user.photo = photo;
                callback(user);
            })
      });
  }

}

module.exports.getUserByToken = AmpedAuthorization.getUserByToken;

module.exports.middleware = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.setUserByToken;

}
