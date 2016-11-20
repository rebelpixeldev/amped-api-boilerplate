'use strict';
const
  AmpedModel = require('./AmpedModel'),
  sequelize = require('sequelize');

class UserRoles extends AmpedModel {

  constructor(app, socket) {
    super(app, socket);
    this.app = app;
    this.models = {};
  }

  addRelations(models){
    this.models = models; // @TODO: Not sure I like this so much
  }

  get schema() {
    return {
      user_id     : sequelize.INTEGER,
      role_id     : sequelize.INTEGER
    }
  }

  get buildCrudRoutes(){ return false;}
}

module.exports = UserRoles;
