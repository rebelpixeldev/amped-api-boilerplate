'use strict';
// @TODO make external npm module

const
  url = require('url');

const Util = {

  getParams : function (req) {
    return Object.assign({}, req.body, req.params, url.parse(req.url, true).query);
  },

  pascalToUnderscore : function (str) {
    return Util.camelToUnderscore(str).replace(/^_/, "");
  },
  camelToUnderscore : function (str) {
    return str.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();}).replace(/^_/, "");
  },

  getTempName : function (append) {
    return Util.generatehash(24) +'-' + new Date().getTime() + '|' + (append.split('?')[0] || '');
  },

  generatehash : function (length) {
    if ( typeof length === 'undefined')
      length = 5;
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
};

module.exports = Util;
