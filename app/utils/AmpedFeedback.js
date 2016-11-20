'use strict';
// @TODO make this an external npm module
const
  url   = require('url');

const defaultParams = {
  token : false
}

class AmpedFeedback{

  constructor(params){
    this._params = Object.assign({}, defaultParams, params);
  }

  onFeedback(req, res, data){
    const
      resp = { success : true, message : '', response : [] },
      params = Object.assign({}, req.body, req.params, url.parse(req.url, true).query);


    if ( typeof data.success !== 'undefined' ){
      resp.success = data.success;
      delete data.success;
    }

    if ( typeof data.message !== 'undefined' ){
      resp.message = data.message;
      delete data.message;
    }

    if ( typeof data.meta !== 'undefined' ){
      resp.meta = data.meta;
      delete data.meta;
    }

    resp.response = typeof data.response !== 'undefined' ? data.response : (data || []);


    res.json(resp);
    return null;

  }

}


module.exports = function (params) {


  const feedback = new AmpedFeedback(params);

  return (req, res, next) => {
      res.feedback = feedback.onFeedback.bind(feedback, req, res);
      next();
  }

};
