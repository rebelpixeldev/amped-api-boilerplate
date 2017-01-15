const
  util    = require('./AmpedUtil');

module.exports = {
  params : (req, res, next) => {
    req.amped = {};
    req.amped.params = util.getParams(req);
    next();
  }
};

