'use strict';
const
  AmpedModel = require('./AmpedModel'),
  sequelize = require('sequelize');

class Resources extends AmpedModel {

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
      name: sequelize.STRING
    }
  }

  get buildCrudRoutes(){ return false;}
}

module.exports = Resources;
