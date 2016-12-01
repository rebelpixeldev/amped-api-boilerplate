'use strict';
// @TODO make external npm module
const url = require('url');

class AmpedAuthorization {

  constructor(params) {
    this._params = params;
  }

  setUserByToken(req, res, next) {
    // if ( req.user )
    //   return req.user;

    const query = url.parse(req.url, true).query;

    if (typeof query.token !== 'undefined') {
      AmpedAuthorization.getUserByToken(req, query.token, (user) => {
        req.auth = user;
        next();
      })
    } else
      next()

  }

  static getUserByToken(req, token, callback) {
    // @TODO do something on catch
    req.dbRef.users.getModel().findOne({where: {token: token}, include: req.dbRef.users.queryIncludes, raw: true})
      .then(user => AmpedAuthorization.convertQueryRelations(user))
      .then((user) => {
        // @TODO re-evaluate if this can be done in a sequelize join or this is alright
        req.db.uploads.findOne({where: {id: user.photo}, raw: true})
          .then((photo) => {
            console.log(user);
            user.photo = photo;
            callback(user);
          })
      });
  }

  static convertQueryRelations(data) {
    console.log(data);
    return Object.keys(data).reduce((ret, key) => {
      console.log(key);
      if (key.indexOf('.') !== -1 ) {
        const parts = key.split('.');
        console.log(parts);
        if ( typeof ret[parts[0]] === 'undefined')
          ret[parts[0]] = {};
        ret[parts[0]][parts[1]] = data[key];
        console.log(data[key]);
      } else {
        ret[key] = data[key];
      }
      return ret;
    }, {});
  }


}

module.exports.getUserByToken = AmpedAuthorization.getUserByToken;
module.exports.convertQueryRelations = AmpedAuthorization.convertQueryRelations;

module.exports.middleware = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.setUserByToken;

}
