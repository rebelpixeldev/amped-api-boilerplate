'use strict';

const url = require('url');

class AmpedAcl{

  constructor(params){
    this._params = params;
  }

  can(permission, resource, eq, res, next){
    // console.log(permission, resource);

    next();
  }

}

module.exports = function (params) {
  const acl = new AmpedAcl(params);

  return {
    can : (permission, resource) => {
        return acl.can.bind(acl, permission, resource);
    }
  };

}
