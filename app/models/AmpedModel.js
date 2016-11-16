'use strict';

//@TODO create two way binding for database entries

const
  AmpedConnector = require('../utils/AmpedConnector'),
  sequelize = require('sequelize'),
  url = require('url');


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

    console.log('Adding routes');
    console.log(this);
    console.log(this.route);
    if (this.buildCrudRoutes) {
      this.app.route(this.route)
        .get(this.getModelData.bind(this))
        .post(this.createModelData.bind(this));

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
    this.DB = AmpedConnector.getConnection().define(this.modelName, this.schemaData);
    // } catch (e){
    //     this.DB = AmpedConnector.getConnection().model(this.constructor.name);
    // }
  }

  /**
   * Routes
   */
  getModelData(req, res) {

    const params = this.getParams(req);

    // @TODO handle errors
    // @TODO handle filter params
    console.log('getting data');

    let sendResponse = (data) => {


      if (data === null)
        data = [];
      res.setHeader('Content-Type', 'application/json');
      res.feedback(
        this.isEditRoute(req.url) ?
        this.editSchema.slice(0).map((item) => {
          item.value = data[item.name] || '';
        return item;
      }) : data);
    };

    (typeof params._id === 'undefined' ?
      this.DB.findAll({where : AmpedModel.buildQuery({})}) :
      this.DB.findOne({where: AmpedModel.buildQuery({id: params._id})}))
      .then(sendResponse)
      .catch((err) => {
        console.log('ERROR', err);
      });

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
    const params = this.getParams(req);

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
        ret = [...ret, {type: typeMap[row.key], label: this.colNameToLabel(field), name : field}];

      return ret;

    }, [{type : 'hidden', name : 'id'}]);
  }

  colNameToLabel(field){
    return field.replace('_', ' ');
  }

  // @TODO make this a helper
  getParams(req) {
    return Object.assign({}, req.body, req.params, url.parse(req.url, true).query);
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
    return '/api/' + this.cleanModelName;
  }

  get cleanModelName(){
    return this.modelName.replace(this.tablePrefix, '');
  }

  get modelName() {
    return this.tablePrefix + this.constructor.name.toLowerCase()
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
