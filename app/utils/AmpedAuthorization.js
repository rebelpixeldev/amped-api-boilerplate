'use strict';

const url = require('url');

class AmpedAuthorization{

  constructor(params){
    this._params = params;
  }

  getUserByToken(req, res, next){
    // if ( req.user )
    //   return req.user;

    const query = url.parse(req.url, true).query;

    if ( typeof query.token !== 'undefined' ) {
      console.log(req.db);
      req.db.users.findOne({where: {token: query.token }})
        .then((data) => {
          req.user = data.dataValues;
          next();
        })
    } else
      next()

  }

}

module.exports = function (params) {
  const auth = new AmpedAuthorization(params);

  return auth.getUserByToken;

}
