'use strict';

const
  config        = require('../config/config'),
  fs            = require('fs'),
  path          = require('path'),
  multer        = require('multer'),
  uploads       = require('amped-api').get('AmpedUploads'),
  util          = require('amped-api').get('AmpedUtil');


var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, config.uploads.tempDir);
	},
	filename: function (req, file, callback) {
		callback(null, util.getTempName(file.originalname));
	}
});
const fileUpload =  multer({ storage : storage }).array('files[]', 200);

class UploadsController{

  constructor(app, socket){
    this.app = app;
    this.socket = socket;
  }

  setupRoutes(){
    this.app.post('/uploads/upload', this.upload.bind(this));
    this.app.get('/uploads/:type/:filename', this.display.bind(this));
  }


	upload(req, res){
		const params = util.getParams(req);

		if ( typeof params.remote_url === 'undefined' ){
			fileUpload(req,res,(err) => {
				if(err) {
					return res.feedback({success:false, message:err});
				}

				const promises = req.files.reduce((ret, file) => ret.concat([uploads.saveImage(req, file.path)]), []);

				Promise.all(promises)
					.then(( resp ) => {
						this.socket.sendSocket('UPLOADS_CREATE', {model:'uploads', account_id:req.user.account_id, user: req.user.id, data: resp}, req.user );
						return resp;
					})
					.then((data) => {
						req.logActivity('upload', `${data.length > 1 ? data.length + ' files were uploaded' : data[0].title + ' was uploaded'}`, data);
						res.feedback(data);
					}).catch((err) => {
					res.feedback({success:false, response:err});
				})
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
      uploadPath = path.join(config.uploads[`${params.type}Dir`], params.filename);

    console.log(uploadPath);

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
