const
  fs      = require('fs'),
  path    = require('path');

module.exports = function (app, socket, controllersPath) {
  fs.readdir(controllersPath, function (err, files) {
    files.forEach(function (file) {
      const
        clss = require(path.join(controllersPath, file)),
        instance = new clss(app, socket);
      instance.setupRoutes();
    })
  })
};
