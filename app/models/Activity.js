'use strict';
const
  AmpedModel  = require('./AmpedModel'),
  sequelize   = require('sequelize');

class Activity extends AmpedModel {

  constructor(app, socket) {
    super(app, socket);
    this.app = app;
  }

  // @TODO add account and user relations
  addRelations(models){
  }

  get schema() {
    return {
      account_id : sequelize.INTEGER,
      user_id: sequelize.INTEGER,
      action : sequelize.TEXT,
      description : sequelize.TEXT,
      data : sequelize.JSON
    }
  }
}

module.exports = Activity;
