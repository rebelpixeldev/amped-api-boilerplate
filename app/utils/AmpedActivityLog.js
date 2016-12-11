'use strict';
// @TODO make this an external npm module
const
  url = require('url');

const defaultParams = {
  token: false
}

class AmpedActivityLog {

  constructor(params) {
    this._params = Object.assign({}, defaultParams, params);
  }

  log(req, action, description, data, user) {

    return new Promise((resolve, reject) => {
      if (typeof user === 'undefined')
        user = req.user;

      if ( typeof user !== 'undefined' && user !== null ) {
        // @TODO figure out something to do with the log when there is no user data
        const entry = {
          user_id: typeof req.user === 'undefined' ? 0 : user.id,
          account_id: typeof req.user === 'undefined' ? 0 : user.account_id,
          action
        };

        if (typeof description !== 'undefined')
          entry.description = description;
        if (typeof data !== 'undefined')
          entry.data = data;

        req.db.activity.create(entry)
          .then((  ) => resolve())
          .catch((err) => {
            console.error(err);
            reject(err);
          })
      }
    })
  }


}


module.exports.middleware = function (params) {

  const activityLog = new AmpedActivityLog(params);

  return (req, res, next) => {
    req.logActivity = activityLog.log.bind(activityLog, req);
    next();
  }

};
