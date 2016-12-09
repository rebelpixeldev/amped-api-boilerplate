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
    } else {
      req.auth = null;
      next()
    }

  }

  static getUserByToken(req, token, callback) {
    // @TODO do something on catch
    // @TODO make this not hardcoded
    console.log(req.url);
    if ( req.url === '/' || req.url === '/login' || req.url === '/register' || req.url === '/reset' || req.url === '/user' )
      return callback(null);

    console.log(token);
    req.dbRef.users.getModel().findOne({where: {token: token}, include: req.dbRef.users.queryIncludes, raw: true})
      .then(user => AmpedAuthorization.convertQueryRelations(user))
      .then((user) => {
        // @TODO re-evaluate if this can be done in a sequelize join or this is alright
        req.db.uploads.findOne({where: {id: user.photo}, raw: true})
          .then((photo) => {
            user.photo = photo;
            user.photo.source_path = `/uploads/source/${user.photo.id}.${user.photo.extension}`;
            user.photo.source_url = `http://localhost:3000/uploads/source/${user.photo.id}.${user.photo.extension}`
            callback(user);
          })
      });
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

module.exports.getUserByToken = AmpedAuthorization.getUserByToken;
module.exports.convertQueryRelations = AmpedAuthorization.convertQueryRelations;

module.exports.middleware = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.setUserByToken;

}
