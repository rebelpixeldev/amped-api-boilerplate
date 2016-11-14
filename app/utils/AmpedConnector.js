'use strict';

const
  connection = null,
  fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize');


class AmpedConnector {

  constructor() {
    this.connection = null;
  }

  static getModel(name) {
    return AmpedConnector.getConnection()[name];
  }

  static getConnection() {
    // @TODO set connection string from config
    if (typeof this.connection === 'undefined') {
      this.connection = new Sequelize('postgres', 'ted', 'Dash111!', {
        dialect: 'postgres',
        define: {
          underscored: true
        }
      });
    }
    return this.connection;
  }

  static buildModels(app, socket) {
    const
      connection = AmpedConnector.getConnection(),
      modelPath = path.join(__dirname, '../models'),
      modelMap = {};

    const dirs = fs.readdirSync(modelPath);
      dirs.forEach((filename) => {
        console.log(filename);
        const
          clss = require(path.join(modelPath, filename)),
          instance = new clss(app, socket);

        modelMap[instance.modelName] = instance.getModel();
      });

    app.use((req, res, next) => {
        req.db = modelMap;
      next();
    })
  }

}
module.exports = AmpedConnector;
