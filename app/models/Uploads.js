'use strict';
// @TODO make it come from external files service
const
  AmpedModel = require('./AmpedModel'),
  sequelize = require('sequelize');

class Uploads extends AmpedModel {

  constructor(app, socket) {
    super(app, socket);
    this.app = app;
    this.models = {};
  }

  addRelations(models){
    this.models = models; // @TODO: Not sure I like this so much
    // models.uploads.getModel().hasOne(models.accounts.getModel());
  }

  get schema() {
    return {
      amp_account_id: sequelize.INTEGER,
      amp_user_id: sequelize.INTEGER,
      title: sequelize.STRING,
      filename : sequelize.STRING,
      mime : sequelize.STRING,
      extension : sequelize.STRING,
      filesize : sequelize.INTEGER,
      width : sequelize.INTEGER,
      height: sequelize.INTEGER
    }
  }

  get defineOptions(){
    return {
      getterMethods : {
        source_path : function(){
          return `/uploads/source/${this.getDataValue('id')}.${this.getDataValue('extension')}`;
        },
        source_url : function(){
          // @TODO hard coded url
          return `http://localhost:3000/uploads/source/${this.getDataValue('id')}.${this.getDataValue('extension')}`;
        }
      }
    }
  }

}

module.exports = Uploads;
