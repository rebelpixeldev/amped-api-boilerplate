'use strict';
const
  AmpedModel = require('./AmpedModel'),
  sequelize = require('sequelize');

class UserSettings extends AmpedModel {

  get getIdColumn(){
    return 'user_id';
  }

  get crudForm() {
    return [
      ['phone_number', 'contact_method']
    ]
  }

  get schema() {
    return {
      user_id           : sequelize.INTEGER,
      phone_number      : sequelize.STRING,
      contact_method : {
        type : sequelize.ENUM( 'email', 'sms', 'phone', 'message')
      }
    }
  }
}

module.exports = UserSettings;
