'use strict';

const
  AmpedAuthorization  = require('./AmpedAuthorization'),
  AmpedAcl            = require('./AmpedAcl'),
  connection          = null,
  fs                  = require('fs'),
  path                = require('path'),
  Sequelize           = require('sequelize');



let models = {},
    modelMap = {};


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
      modelPath = path.join(__dirname, '../models'); // @TODO pass a reference

    const dirs = fs.readdirSync(modelPath);
    models = dirs.reduce((carry, filename) => {
      if ( filename.toLowerCase() !== 'ampedmodel.js') {
        const
          clss = require(path.join(modelPath, filename)),
          instance = new clss(app, socket);

        modelMap[instance.cleanModelName] = instance.getModel();
        carry[instance.cleanModelName] = instance;
      }
      return carry;
    }, {});



  }

  static addMiddleware(app, socket){
    app.use((req, res, next) => {
      req.db = modelMap;
      next();
    });

    app.use(AmpedAuthorization());

    Object.keys(models).forEach(key => models[key].addRoutes());
  }

}
module.exports = AmpedConnector;
