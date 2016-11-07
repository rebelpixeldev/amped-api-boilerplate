'use strict';

const
  connection = null,
  Sequelize = require('sequelize');


class AmpedConnector {

  constructor() {
    this.connection = null;
  }

  static getConnection() {
    // @TODO set connection string from config
    if (typeof this.connection === 'undefined')
      this.connection = new Sequelize('postgres', 'ted', 'Dash111!', {
        dialect     : 'postgres',
        define: {
          underscored: true
        }
      });
    return this.connection;
  }

}
module.exports = AmpedConnector;
