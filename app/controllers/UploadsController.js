'use strict';

const
  fs            = require('fs'),
  path          = require('path'),
  uploads       = require('../utils/AmpedUploads'),
  util          = require('../utils/AmpedUtil');

// @TODO make come from external config file
const config = {
  uploads :{
    baseDir : path.join(__dirname, '../uploads'),
    thumbDir : path.join(__dirname, '../uploads/thumb'),
    sourceDir : path.join(__dirname, '../uploads/source'),
    tempDir : path.join(__dirname, '../uploads/source')
  }
};


class UploadsController{

  constructor(app){
    this.app = app;
  }

  setupRoutes(){
    this.app.get('/uploads/upload', this.upload.bind(this));
    this.app.get('/uploads/:type/:filename', this.display.bind(this));
  }


  upload(req, res){
    const params = util.getParams(req);

    console.log(params);

    if ( typeof params.remote_url === 'undefined' ){

    } else {
      uploads.downloadRemote(params.remote_url)
        .then(uploads.saveImage.bind(this, req))
        .then((resp) => res.feedback(resp))
        .catch((err) => {
            console.log(err);
        })
    }
  }

  display(req, res){
    const
      params = util.getParams(req),
      uploadPath = path.join(__dirname, '../uploads', params.type, params.filename);

    fs.exists(uploadPath, (exists) => {
        if ( exists )
          fs.createReadStream(uploadPath).pipe(res);
      else{
          res.status(404).send('Image not found');
        }

    })



  }
}

module.exports = UploadsController;
