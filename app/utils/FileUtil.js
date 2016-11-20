'use strict';

class FileUtil{

  static extensionToMime(ext){
    switch ( ext.toLowerCase() ){
      case 'jpg':
      case 'jpeg':
        return 'image/jpg';
      case 'png':
        return 'image/png';
    }
  }

}

module.exports = FileUtil;
