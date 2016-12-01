'use strict';

const
  fs            = require('fs'),
  path          = require('path'),
  multer        = require('multer'),
  uploads       = require('../utils/AmpedUploads'),
  util          = require('../utils/AmpedUtil');


// @TODO make come from external config file
const config = {
  uploads :{
    baseDir : path.join(__dirname, '../uploads'),
    thumbDir : path.join(__dirname, '../uploads/thumb'),
    sourceDir : path.join(__dirname, '../uploads/source'),
    tempDir : path.join(__dirname, '../uploads/tmp')
  }
};


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.uploads.tempDir);
  },
  filename: function (req, file, callback) {
    console.log();
    callback(null, util.getTempName(file.originalname));
  }
});
const fileUpload =  multer({ storage : storage }).array('files[]', 200);


class UploadsController{

  constructor(app){
    this.app = app;
  }

  setupRoutes(){
    this.app.post('/uploads/upload', this.upload.bind(this));
    this.app.get('/uploads/:type/:filename', this.display.bind(this));
  }


  upload(req, res){
    console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *UPLOAD\n 8 * * * * * * * * * * ');
    const params = util.getParams(req);

    console.log(params);
    console.log(req.user);

    console.log(req.files);

    if ( typeof params.remote_url === 'undefined' ){
      fileUpload(req,res,function(err) {
        console.log('HERE');
        console.log(err);
        console.log(req.files);

        if(err) {
          return res.end("Error uploading file.");
        }

        const promises = req.files.reduce((ret, file) => ret.concat([uploads.saveImage(req, file.path)]), []);
        //
        // console.log(promises);

        // uploads.saveImage(req, req.files[0].path)
        //   .then((saved) => {
        //       console.log('SAVED');
        //   })

        Promise.all(promises)
          .then((data) => {
            res.feedback(data);
          }).catch((err) => {
              res.feedback({success:false, response:err});
          })
        //console.log(req.body);
        //console.log(req.files);
      });

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
