'use strict';
// @TODO make external npm module

const
  AmpedAuthorization  = require('./AmpedAuthorization'),
  AmpedAcl            = require('./AmpedAcl'),
  connection          = null,
  fs                  = require('fs'),
  path                = require('path'),
  Sequelize           = require('sequelize');



let models = {},
    modelMap = {};

/**
 * Used as the connector to the database for the app
 */
class AmpedConnector {

  constructor() {
    this.connection = null;
  }

  /**
   * Gets a sequelize database model by name
   *
   * @param {string} name  - The name of the model that wants to be found
   *
   * @returns {Sequelize}    - Sequelize database object
   */
  // static getModel(name) {
  //   return AmpedConnector.getConnection()[name];
  // }

  /**
   * Gets the connection to the database. If it has already been created, the existing connection will be returned
   *
   * @returns {null|Sequelize} - Sequelize datbase object
   */
  static getConnection() {
    // @TODO set connection string from config
    if (typeof this.connection === 'undefined') {
      this.connection = new Sequelize('postgres', 'ted', 'Dash111!', {
      // this.connection = new Sequelize('postgres', 'darijaradic', 'M0ther', {
        dialect: 'postgres',
        logging:false,
        define: {
          underscored: true
        }
      });
    }
    return this.connection;
  }

  /**
   * Builds all the Sequalize models.
   *
   * Loops through the models directory
   * Creates a new instance of the model
   * Adds all the models to the a local object for use with `self.getModel`
   * Once done, call addRelations on each model
   *
   * @param {object} app          - Global express app object
   * @param {AmpedSocket} socket  - Amped socket instance
   */
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

        modelMap[instance.modelName] = instance.getModel();
        carry[instance.modelName] = instance;
      }
      return carry;
    }, {});

    Object.keys(models).forEach( key => models[key].addRelations(models));

  }

  /**
   * Middleware function to attach the models to the request object.
   *
   * @param {object} app          - Global express app object
   * @param {AmpedSocket} socket  - Amped socket instance
   *
   * @returns {function}          - Express middleware function
   */
  static databaseMiddleware(app, socket){
    return (req, res, next) => {
      req.db = modelMap;
      req.dbRef = models;
      next();
    }
  }

  static getModelRef(name){
    return models[name]
  }

  /**
   * Middleware function to attach all the model crud routes
   *
   * @param {object} app          - Global express app object
   * @param {AmpedSocket} socket  - Amped socket instance
   *
   * @returns {function}          - Express middleware function
   */
  static crudRouteMiddleware(app, socket){
    return (req, res, next) => {
      Object.keys(models).forEach(key => models[key].addRoutes());
      next();
    };
  }
}

// Export AmpedConnector instance
module.exports = AmpedConnector;
