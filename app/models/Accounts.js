'use strict';
const
  AmpedModel  = require('./AmpedModel'),
  sequelize   = require('sequelize');

class Accounts extends AmpedModel {

  constructor(app, socket) {
    super(app, socket);
    this.app = app;
  }

  get schema() {
    return {
      name: sequelize.STRING,
      address: sequelize.STRING,
      city: sequelize.STRING,
      state: sequelize.STRING,
      country: sequelize.STRING

    }
  }
}

  // id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_accounts_id_seq'::regclass),
  // name CHARACTER VARYING(255),
  // address CHARACTER VARYING(255),
  // city CHARACTER VARYING(100),
  // state CHARACTER VARYING(100),
  // country CHARACTER VARYING(100)

module.exports = Accounts;
