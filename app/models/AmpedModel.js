'use strict';

//@TODO create two way binding for database entries

const
  AmpedConnector    = require('../utils/AmpedConnector'),
  acl               = require('../utils/AmpedAcl')({}),
  sequelize         = require('sequelize'),
  url               = require('url'),
  util              = require('../utils/AmpedUtil');


const typeMap = {
  STRING : 'text',
  JSON : 'json_text',
  INTEGER : 'number',
  DATE : 'date'
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

      this.app.get(this.route, acl.can('view', this.modelName), this.getModelData.bind(this));

      // this.app.route(this.route, acl.can('view', this.model))
      //   .get(this.getModelData.bind(this))
      //   .post(this.createModelData.bind(this));

      this.app.route(this.route + '/:_id')
        .get(this.getModelData.bind(this))
        .post(this.updateModelData.bind(this))
        .put(this.updateModelData.bind(this))
        .delete(this.deleteModelData.bind(this));

      this.app.route(this.route + '/edit/:_id')
        .get(this.getModelData.bind(this));
    }
  }

  registerSchema() {
    // try {
    this.DB = AmpedConnector.getConnection().define(this.modelName, this.schemaData, Object.assign({}, this.defaultDefineOptions, this.defineOptions));

    // } catch (e){
    //     this.DB = AmpedConnector.getConnection().model(this.constructor.name);
    // }
  }

  addRelations(models){}

  /**
   * Routes
   */
  getModelData(req, res) {

    const params = util.getParams(req);

    // @TODO handle errors
    // @TODO handle filter params
    console.log('getting data');

    if ( this.getQuery() !== false ){
      this.getQuery(req, res, params);
    } else {

      (typeof params._id === 'undefined' ?
        this.DB.findAll({where: AmpedModel.buildQuery({}), include: this.queryIncludes}) :
        this.DB.findOne({where: AmpedModel.buildQuery({id: params._id})}, this.queryIncludes))
        .then(this.sendResponse.bind(this, req, res))
        .catch((err) => {
          console.log('ERROR', err);
        });
    }

  }

  sendResponse(req, res, data){


    if (data === null)
      data = [];
    res.setHeader('Content-Type', 'application/json');
    res.feedback(
      this.isEditRoute(req.url) ?
        this.editSchema.slice(0).map((item) => {
          item.value = data[item.name] || '';
          return item;
        }) : data);
    return null;
  };

  getQuery(params){
    return false;
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

    this.DB.findById(params.id)
      .then((result) => {
          delete params.id;
          result.updateAttributes(params)
            .then(() => {
              res.feedback();
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

  isEditRoute(url){
    return url.split('/')[3] === 'edit';
  }

  buildEditSchema(){
    // @TODO might run into issues with the default schema not being able to be in the editable schema that is returned. But probably not..
    return Object.keys(this.schema).reduce((ret, field) => {
        const row = this.schema[field];

      if ( typeof row.user_editable === 'undefined' || row.user_editable )
        ret = [...ret, {type: row.field_type || typeMap[row.key], label: this.colNameToLabel(field), name : field}];

      return ret;

    }, [{type : 'hidden', name : 'id'}]);
  }

  colNameToLabel(field){
    return field.replace('_', ' ');
  }

  getEvent(evt) {
    return [this.modelName, evt].join('_').toUpperCase();
  }

  sendSocket(evt, data) {
    this.socket.sendSocket(this.getEvent(evt), data);
  }

  getModel() {
    return this.DB;
  }

  get queryIncludes(){return []}

  static buildQuery(query) {
    // return Object.assign({deleted_at : { $exists : false}}, query);
    return query;
  }

  get tablePrefix(){
    return 'amp_';
  }

  get connection() {
    return connection;
  }

  get route() {
    return '/api/' + this.modelName;
  }

  get modelName(){ return this.baseName; }
  get tableName() { return this.tablePrefix + this.baseName; }
  get baseName(){ return util.pascalToUnderscore(this.constructor.name) }

  get schema() {
    return {};
  }

  get schemaData() {
    return Object.assign({}, this.defaultSchema, this.schema);
  }

  get buildCrudRoutes() {
    return true;
  }

  get defineOptions(){
    return {};
  }

  get defaultDefineOptions(){
    return {
      underscored : true,
      paranoid : true,
      freezeTable : true,
      tableName : this.tableName
    }
  }

  get defaultSchema() {
    return {
      created_at: {type: sequelize.DATE, user_editable : false},
      updated_at: {type: sequelize.DATE, user_editable : false},
      deleted_at: {type: sequelize.DATE, user_editable : false},
      deleted_by: {type: sequelize.INTEGER, user_editable : false}
    }
  }
}

module.exports = AmpedModel;
