'use strict';

//@TODO create two way binding for database entries

const
  AmpedConnector = require('../utils/AmpedConnector'),
  acl = require('../utils/AmpedAcl')({}),
  sequelize = require('sequelize'),
  url = require('url'),
  util = require('../utils/AmpedUtil');


const typeMap = {
  STRING: 'text',
  JSON: 'json_text',
  INTEGER: 'number',
  DATE: 'date'
};

class AmpedModel {

  constructor(app, socket) {
    this.app = app;
    this.socket = socket;
    this.editSchema = this.buildEditSchema();

    this.registerSchema();


    // this.setupRoutes();
  }

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

  registerSchema() {
    // try {
    this.DB = AmpedConnector.getConnection().define(this.modelName, this.schemaData, Object.assign({}, this.defaultDefineOptions, this.defineOptions));

    // } catch (e){
    //     this.DB = AmpedConnector.getConnection().model(this.constructor.name);
    // }
  }

  addRelations(models) {
  }

  /**
   * Routes
   */
  // @TODO handle errors
  // @TODO handle filter params
  // @TODO fix this naming mess
  getModelDataRoute(req, res, params) {

    this.getModelData(req, res);
    // console.log(params);
    // if ( typeof params === 'undefined')
    //   params = util.getParams(req);
    // console.log(params);
    //
    // const promise = this.getQuery(req, res, params);
    //
    // if ( typeof promise !== 'undefined' ){
    //   promise
    //     .then(this.sendResponse.bind(this, req, res))
    //     .catch((err) => {
    //       console.log('ERROR', err);
    //     });
    // }
  }

  getModelData(req, res, params) {

    if ( typeof params === 'undefined')
      params = util.getParams(req);

    return this.getQuery(req, res, params)
        .then(this.sendResponse.bind(this, req, res))
        .catch((err) => {
          console.log('ERROR', err);
        });
  }


  sendResponse(req, res, data) {

    if (data === null)
      data = [];
    res.setHeader('Content-Type', 'application/json');

    res.feedback(
      this.isEditRoute(req.url) ?
        this.editSchema.slice(0).map((row) => {
          return row.map((col) => {
            col.value = data[col.name] || '';
            return col;
          });
        }) : data);
    return data;
  };

  getQuery(req, res, params) {

    return (typeof params._id === 'undefined' ?
      this.DB.findAll({where: AmpedModel.buildQuery({}), include: this.queryIncludes}) :
      this.DB.findOne({where: AmpedModel.buildQuery({id: params._id}), include : this.queryIncludes }));
  }

  createModelData(req, res) {
    // @TODO Check values being sent against the schema
    // @TODO handle errors
    // const
    //     params = this.getParams(req),
    //     entry = new this.DB(params);
    //
    // entry.save((err) => {
    //     this.sendSocket('create', entry);
    //     res.json(entry);
    // });
  }

  updateModelData(req, res) {
    // @TODO Check values being sent against the schema
    // @TODO handle errors
    const params = util.getParams(req);

    // @TODO Check values being sent against the schema VERRY TEMP ---\/
    if ( typeof params.photo !== 'undefined' && params.photo === '' )
      params.photo = 0;

    const data = this.dotNotationToObject(params);

    this.DB.findById(data.id)
      .then((result) => {
        // Remove things that are read only in crud
        delete data.id; delete data.token; delete data._id;
        const attrs = Object.keys(data).reduce((ret, key) => {
          if (typeof data[key] === 'object') {

            const type = this.schema[key].key || this.schema[key].type.key;

            switch(type){
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
              })


            // this.getQuery(req, res, {_id:params._id})
            //   .then((data) => {
            //     // console.log(req);
            //     console.log(_req.user);
            //     this.sendSocket('UPDATE', {user_id: params.id, data });
            //     this.logActivity(req, 'update', `${this.modelName} was updated`, data);
            //     this.sendResponse(req, res, data)
            //   })
          });
      });

  }

  deleteModelData(req, res) {
    // @TODO Check values being sent against the schema
    // @TODO handle errors
    // const params = this.getParams(req);
    //
    // if ( typeof params._id === 'undefined' )
    //     res.send('no id');
    // else
    //     this.DB.update({_id:params._id}, {deleted_at:new Date().getTime()}, {}, (err, raw) => {
    //         res.send('removed successfully');
    //     });

  }

  isEditRoute(url) {
    return url.split('/')[3] === 'edit';
  }


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

  colNameToLabel(field) {
    return field.replace('_', ' ');
  }

  getEvent(evt) {
    return [this.modelName, evt].join('_').toUpperCase();
  }

  sendSocket(evt, data) {
    this.socket.sendSocket(this.getEvent(evt), data);
  }

  logActivity(req, action, description, data){
    req.logActivity(action, description, data);
  }

  getModel() {
    return this.DB;
  }

  get queryIncludes() {
    return [];

  }

  get crudForm() {
    return []
  }

  static buildQuery(query) {
    // return Object.assign({deleted_at : { $exists : false}}, query);
    return query;
  }

  get tablePrefix() {
    return 'amp_';
  }

  get connection() {
    return connection;
  }

  get route() {
    return '/api/' + this.modelName;
  }

  get modelName() {
    return this.baseName;
  }

  get tableName() {
    return this.tablePrefix + this.baseName;
  }

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

  get defaultSchema() {
    return {
      created_at: {type: 'TIMESTAMP', user_editable: false},
      updated_at: {type: 'TIMESTAMP', user_editable: false},
      deleted_at: {type: 'TIMESTAMP', user_editable: false},
      deleted_by: {type: sequelize.INTEGER, user_editable: false}
    }
  }
}

module.exports = AmpedModel;
