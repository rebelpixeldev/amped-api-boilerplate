'use strict';

class FileUtil{

  /**
   * Converts extension to a mime type used when dealing with uploads
   *
   * @param {string} ext - A extension
   * @returns {string}
   */
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
