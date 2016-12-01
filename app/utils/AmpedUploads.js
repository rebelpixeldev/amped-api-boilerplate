// @TODO replace promises with generators
'use strict';

const
  fileUtil = require('./FileUtil'),
  fs = require('fs'),
  gm = require('gm'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  request = require('request'),
  url = require('url'),
  util = require('./AmpedUtil');

// @TODO should come from global config
const config = {
  uploads: {
    sourcefilePath : '/uploads/source',
    baseDir: path.join(__dirname, '../uploads'),
    thumbDir: path.join(__dirname, '../uploads/thumb'),
    sourceDir: path.join(__dirname, '../uploads/source'),
    tempDir: path.join(__dirname, '../uploads/tmp')
  }
};

class AmpedUploads {

  static getFileInfo(filepath) {
    return new Promise((resolve, reject) => {
      gm(filepath).identify((err, info) => {
        if ( err )reject(err);
        else resolve(info)
      })
    })
  }

  static saveImage(req, tmpFilePath) {
    return new Promise((resolve, reject) => {
      AmpedUploads.getFileInfo(tmpFilePath)
        .then((info) => {
          const
            filename = tmpFilePath.split('/').pop().split('|').pop().split('?')[0],
            extension = tmpFilePath.split('.').pop().split('?')[0];
          req.db.uploads.create({
              amp_account_id : req.auth.account.id,
              amp_user_id : req.auth.id,
              title : filename.replace('.'+extension, ''),
              mime : fileUtil.extensionToMime(extension),
              filename : filename,
              extension : extension,
              filesize : parseFloat(info.Filesize),
              width : info.size.width,
              height : info.size.height
            })
            .then((upload) => {
              const
                info = upload.get({plain : true}),
                filename = `${info.id}.${info.extension}`,
                srcPath = path.join(config.uploads.sourceDir, filename);
              // resolve(upload.get({plain : true}))

              info.filepath = `${config.uploads.sourcefilePath}/${filename}`;

              AmpedUploads.moveImage( tmpFilePath, srcPath )
                  .then((tmpPath) => {
                    AmpedUploads.removeImage(tmpPath)
                      .then( resolve.bind(this, info) )
                      .catch(err => reject(err));
                  })
                  .catch(err => reject(err));
            })
            .catch(err => reject(err))
        })
    })
  }

  static moveImage(originalPath, destPath){
    return new Promise((resolve, reject) => {
      fs.readFile(originalPath, (err, data) => {
        if ( err ) reject(err);
        else
          fs.writeFile(destPath, data, (err) => {
              if ( err ) reject(err);
              else resolve(originalPath);
          });
      });
    })
  }

  static removeImage(filepath){
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, function (err) {
          if ( err ) reject(err);
          else resolve();
        })
    })
  }

  static downloadRemote(remoteUrl) {
    return new Promise((resolve, reject) => {
      const
        filename = remoteUrl.split('/').pop(),
        dest = path.join(config.uploads.tempDir, util.getTempName(filename)),
        file = fs.createWriteStream(dest),
        getFunc = url.parse(remoteUrl).protocol === 'https' ? https : http;

      request.head(remoteUrl, function (err, res, body) {
        request(remoteUrl).pipe(fs.createWriteStream(dest))
          .on('close', resolve.bind(this, dest))
          .on('error', reject);
      });
    });
  }

}

module.exports = AmpedUploads;
