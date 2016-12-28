'use strict';

//@TODO create two way binding for database entries

const
  AmpedConnector = require('../utils/AmpedConnector'),
  acl = require('../utils/AmpedAcl')({}),
  sequelize = require('sequelize'),
  url = require('url'),
  util = require('../utils/AmpedUtil');

/**
 * Maps a sequelize type to client side type for use in building the crud forms and data tables
 *
 * @type {object}
 */
const typeMap = {
  STRING: 'text',
  JSON: 'json_text',
  INTEGER: 'number',
  DATE: 'date'
};

class AmpedModel {

  /**
   *
   * @param {ExpressApp} app
   * @param {AmpedSocket} socket
   */
  constructor(app, socket) {
    this.app = app;
    this.socket = socket;
    this.editSchema = this.buildEditSchema();

    this.registerSchema();
  }

  /**
   * @TODO add acl middleware onto the routes
   * Adds the crud routes to the app if the model has enabled `buildCrudRoutes`
   */
  addRoutes() {

    if (this.buildCrudRoutes) {

      this.app.get(this.route, this.getModelDataRoute.bind(this));

      // this.app.route(this.route, acl.can('view', this.model))
      //   .get(this.getModelData.bind(this))
      //   .post(this.createModelData.bind(this));

      this.app.post(this.route + '/:_id', this.updateModelData.bind(this));

      this.app.route(this.route + '/:_id')
        .get(this.getModelDataRoute.bind(this))
        .post(this.updateModelData.bind(this))
        .put(this.updateModelData.bind(this))
        .delete(this.deleteModelData.bind(this));

      this.app.route(this.route + '/edit/:_id')
        .get(this.getModelDataRoute.bind(this));
    }
  }

  /**
   * Registers the current models schema so it can be queried on
   */
  registerSchema() {
    this.DB = AmpedConnector.getConnection().define(this.modelName, this.schemaData, Object.assign({}, this.defaultDefineOptions, this.defineOptions));
  }

  /**
   * Should be extended in the child model class.
   *
   * It is used to provide relations for the egarloading in queries
   * @param models
   */
  addRelations(models) {}

  /**
   * Routes
   */
  /**
   * @TODO handle errors
   * @TODO fix this naming mess
   *
   * Handles the callback to the get request in the crud routes
   *
   * @param {object} req - Express request object
   * @param {object} res  - Express response object
   */
  getModelDataRoute(req, res) {
    this.getModelData(req, res);
  }

  /**
   * @TODO handle errors
   *
   * This should be overidden if you need to return a custom set of data.
   * By default it will fetch the data from the current model
   *
   * @param {object} req    - Express request object
   * @param {object} res    - Express response object
   * @param {object} params - Parameters that are used in the request
   */
  getModelData(req, res, params) {

    if ( typeof params === 'undefined')
      params = util.getParams(req);

    return this.getQuery(req, res, params)
        .then(this.sendResponse.bind(this, req, res))
        .catch((err) => {
          console.log('ERROR', err);
        });
  }


  /**
   * Sends the response.
   *
   * This will check if the route is an edit route or not.
   *    If it is an edit route the editSchema is copied and the values is added to the orm fields
   *    If it is just a get route, return the data
   * @param req
   * @param res
   * @param data
   * @returns {*}
   */
  sendResponse(req, res, data) {

    if (data === null)
      data = [];
    res.setHeader('Content-Type', 'application/json');

    res.feedback(
      this.isEditRoute(req.url) ?
        this.editSchema.slice(0).map((row) => {
          return row.map((col) => {
            console.log(col);
            col.value = col.name === 'id' ? data[col.name] : data[this.schemaData[col.name].value_field] || data[col.name] || '';
            return col;
          });
        }) : data);
    return data;
  };

  /**
   * Builds the get query for the current model.
   * If anything needs to be done that cannot be achieved with egarloading and the `getIncludes` method,
   * override this method
   *
   * @param {object} req    - Express request object
   * @param {object} res    - Express response object
   * @param {object} params - The params of the current request
   *
   * @returns {Promise} - A sequelize promise
   */
  getQuery(req, res, params) {

    return (typeof params._id === 'undefined' ?
      this.DB.findAll(this.buildQuery({}, params)) :
      this.DB.findOne(this.buildQuery({where:{id: params._id}}, params)));
  }

  /**
   * Deprecate
   * @param {object} req - Express request object
   * @param {object} res  - Express response object
   */

  // createModelData(req, res) {
  //   // @TODO Check values being sent against the schema
  //   // @TODO handle errors
  //   // const
  //   //     params = this.getParams(req),
  //   //     entry = new this.DB(params);
  //   //
  //   // entry.save((err) => {
  //   //     this.sendSocket('create', entry);
  //   //     res.json(entry);
  //   // });
  // }

  /**
   * @TODO Check values being sent against the schema
   * @TODO handle errors
   *
   * Route handler for the update route.
   * Will convert the dot notation keys to objects
   *
   * @param {object} req - Express request object
   * @param {object} res  - Express response object
   */
  updateModelData(req, res) {
    //
    //
    const params = util.getParams(req);

    // @TODO Check values being sent against the schema VERRY TEMP ---\/. use this.paramsToQuery
    if ( typeof params.upload_id !== 'undefined' && params.upload_id === '' )
      params.upload_id = 0;

    const data = this.dotNotationToObject(params);

    this.DB.findById(data.id)
      .then((result) => {
        // Remove things that are read only in crud
        delete data.id; delete data.token; delete data._id;
        const attrs = Object.keys(data).reduce((ret, key) => {
          if (typeof data[key] === 'object') {

            switch(this.schema[key].key || this.schema[key].type.key){
              case 'INTEGER':
                ret[key] = data[key].id;
                    break;
              case 'JSON':
                ret[key] = data[key];
                    break;
            }

          } else ret[key] = data[key];
          return ret;

        }, {});

        result.updateAttributes(attrs)
          .then(() => {

            this.getModelData(req, res, {_id:params._id})
              .then((user) => {
                this.sendSocket('UPDATE', {user_id: params.id, user });
                this.logActivity(req, 'update', `${this.modelName} was updated`, user);
              });
          });
      });

  }

  /**
   * @TODO actually build it
   * @TODO Check values being sent against the schema
   * @TODO handle errors
   * Route handler for the delete route.
   *
   * Deletes a resource from the database
   *
   * @param {object} req - Express request object
   * @param {object} res  - Express response object
   */
  deleteModelData(req, res) {
    // const params = this.getParams(req);
    //
    // if ( typeof params._id === 'undefined' )
    //     res.send('no id');
    // else
    //     this.DB.update({_id:params._id}, {deleted_at:new Date().getTime()}, {}, (err, raw) => {
    //         res.send('removed successfully');
    //     });

  }

  /**
   * @TODO make the edit keyword in the url dynamic from a config variable
   *
   * Checks whether or not the route is an edit route or not
   *
   * @param {string} url - the url that should be checked for the edit route
   *
   * @returns {boolean}
   */
  isEditRoute(url) {
    return url.split('/')[3] === 'edit';
  }

  /**
   * @TODO deprecate - The same function exists in AmpedUtil
   * @see AmpedUtil.dotNotationToObject
   */
  dotNotationToObject(obj) {
    return Object.keys(obj).reduce((ret, key) => {
      if (key.indexOf('.') !== -1) {

        const parts = key.split('.');

        if (typeof ret[parts[0]] === 'undefined')
          ret[parts[0]] = {};

        ret[parts[0]][parts[1]] = obj[key];
        return ret;

      } else {
        ret[key] = obj[key];
        return ret;
      }
    }, {});
  }

  /**
   * Builds the edit schema for use when returning the crud form structure that is used on the client side.
   * If a custom crud for is needed, this function should be overridden
   */
  buildEditSchema() {
    const fields = this.crudForm.reduce((ret, row) => {
      return [...ret, row.reduce((colRet, col) => {
        const
          colName = typeof col === 'string' ? col : col.field,
          row = this.schema[colName];

        let type = row.field_type;

        if (typeof row.field_type === 'undefined')
          type = (typeof row.type === 'undefined' ? typeMap[row.key] : typeMap[row.type])

        return [...colRet, {type, label: this.colNameToLabel(colName), name: colName}]
      }, [])]
    }, [[{type: 'hidden', name: 'id'}]]);

    return fields;
  }

  /**
   * Builds the get query taking into account the sort order, sort field, page, and perpage
   *
   * @param {object} baseQuery - The base query that all the meta info should be added onto
   * @param {object} params - The params for the current request
   * @returns {object}
   */
  buildQuery(baseQuery, params) {

    const query = Object.assign({}, baseQuery);

    if (typeof query.include === 'undefined')
      query.include = this.queryIncludes;


    const {order_by = this.queryOrderBy, order = this.queryOrder} = params;
    query.order = typeof params.order === 'undefined' ? `${order_by} ${order}` : params.order;
    query.limit = typeof params.limit === 'undefined' ? this.queryPerPage : params.limit;



    //@TODO add json querying
    query.attributes = {exclude: ['deleted_at', 'deleted_by']};
    query.where = Object.assign({}, this.paramsToQuery(params), (query.where || {}));

    // console.log(query);

    return query;

  }

  /**
   * Checks if the value of a column is valid
   *
   * @param {any} value                   - The value that is to be checked
   * @param {any:boolean} additionalCheck - Any other check conditions
   * @returns {boolean}
   */
  schemaValueValid(value, additionalCheck = true ){
    return (typeof value !== 'undefined' &&
    value !== null &&
    value !== '' &&
    additionalCheck);
  }

  /**
   * Converts the params that have been sent to search by to a proper query which takes type into consideration
   *
   * @param {object} params - The params for the current request
   *
   * @returns {object}
   */
  paramsToQuery(params){
    return Object.keys(params).reduce((ret, paramKey) => {
      if ( paramKey === 'id' || paramKey === '_id')
        ret.id = params[paramKey];
      else if ( typeof this.schemaData[paramKey] !== 'undefined' ){
        switch(this.schema[paramKey].key || this.schema[paramKey].type.key){
          case 'INTEGER':
            ret[paramKey] =  this.schemaValueValid(params[paramKey], !isNaN(parseInt(params[paramKey]))) ?
              parseInt(params[paramKey]) : 0;
            break;
          default:
            ret[paramKey] = params[paramKey].toString();
            break;
        }
      }
      return ret;
    }, {});
  }

  /**
   * @TODO deprecate - Should be moved to AmpedUtil
   * Converts underscore to spaces to get a title
   * @param field
   */
  colNameToLabel(field) {
    return field.replace('_', ' ');
  }

  /**
   * Builds the event name to be used with sockets based on the modelName and evt that is passed
   *
   * @param {string} evt - The string that should be the suffix on the modelName
   *
   * @returns {string}
   */
  getEvent(evt) {
    return [this.modelName, evt].join('_').toUpperCase();
  }

  /**
   * Emits a socket emit using AmpedSocket
   *
   * @param {string} evt  - The event to be emitted
   * @param {any} data    - The data that should be sent with the socket
   */
  sendSocket(evt, data) {
    this.socket.sendSocket(this.getEvent(evt), data);
  }

  /**
   * Logs an activity using the AmpedActivityLog
   *
   * @param {object} req          - Express request object
   * @param {string} action       - The action that is passed to the activity log
   * @param {string} description  - The description to be passed to the activity log
   * @param {any} data            - The data that should be passed to the activity log
   */
  logActivity(req, action, description, data){
    req.logActivity(action, description, data);
  }

  /**
   * Return the Sequelize model for the current class
   * @returns {Model|*}
   */
  getModel() {return this.DB;}

  /**
   * Get the includes for use in the get query and used with the Sequelize egar loading
   * @returns {Array}
   */
  get queryIncludes() {return [];}

  /**
   * The default column to order by when fetching the data from the model
   * @returns {string}
   */
  get queryOrderBy() {return 'updated_at';}

  /**
   * The default sort order when fetching data from the model
   * @returns {string}
   */
  get queryOrder() {return 'DESC';}

  /**
   * The default per page when fetching data
   * @returns {number}
   */
  get queryPerPage(){return 10000;}

  /**
   * The default crud form that is returned when getting the edit route
   * When an empty array is passed, each field is returned on its own line.
   * @returns {Array}
   */
  get crudForm() {return [];}


  get tablePrefix() {
    return 'amp_';
  }

  get connection() {
    return connection;
  }

  /**
   * @TODO make `api` dynamic
   *
   * The default route for crud routes in the model
   *
   * @returns {string}
   */
  get route() {
    return '/api/' + this.modelName;
  }

  /**
   * The model name which is saved into the sequelize object
   * @returns {*}
   */
  get modelName() {
    return this.baseName;
  }

  /**
   * The name of the models table
   * @returns {*}
   */
  get tableName() {
    return this.tablePrefix + this.baseName;
  }

  /**
   * Get the name that is used in the model name and table name which is created from the filename
   * @returns {string}
   */
  get baseName() {
    return util.pascalToUnderscore(this.constructor.name)
  }

  get schema() {
    return {};
  }

  get schemaData() {
    return Object.assign({}, this.defaultSchema, this.schema);
  }

  get buildCrudRoutes() {
    return true;
  }

  get defineOptions() {
    return {};
  }

  get defaultDefineOptions() {
    return {
      underscored: true,
      paranoid: true,
      freezeTable: true,
      tableName: this.tableName
    }
  }

  /**
   * The default columns that should be on every model
   * @returns {object}
   */
  get defaultSchema() {
    return {
      // id : {type : sequelize.INTEGER, primaryKey: true},
      created_at: {type: 'TIMESTAMP', user_editable: false},
      updated_at: {type: 'TIMESTAMP', user_editable: false},
      deleted_at: {type: 'TIMESTAMP', user_editable: false},
      deleted_by: {type: sequelize.INTEGER, user_editable: false}
    }
  }
}

module.exports = AmpedModel;
