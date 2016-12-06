'use strict';
const
  AmpedAuthorization = require('../utils/AmpedAuthorization'),
  AmpedModel = require('./AmpedModel'),
  sequelize = require('sequelize');

class Users extends AmpedModel {

  constructor(app, socket) {
    super(app, socket);
    this.app = app;
    this.models = {};
  }

  addRelations(models) {
    this.models = models; // @TODO: Not sure I like this so much
    models.users.getModel().belongsTo(models.accounts.getModel(), {foreignKey: 'account_id'});
  }

  /**
   * @TODO handle errors
   * @TODO this is wayyy to cumbersome to expect a dev to do when they want to write their own get queries, figure out a better way
   */
  getQuery(req, res, params) {
    return new Promise((resolve, reject) => {
      if (typeof req !== 'undefined') {
        (typeof params._id === 'undefined' ?
          this.DB.findAll({where: AmpedModel.buildQuery({}), include: this.queryIncludes}) :
          this.DB.findOne({where: AmpedModel.buildQuery({id: params._id}), include: this.queryIncludes, raw: true})
            .then(user => AmpedAuthorization.convertQueryRelations(user)))
          .then((user) => {
            req.db.uploads.findOne({where: {id: user.photo}})
              .then((photo) => {
                user.photo = photo;
                this.sendResponse(req, res, user);
                resolve(user);
              })
          })
      } else reject('Request was not defined');
      return true;
    })

  }

  get crudForm() {
    return [
      ['display_name', 'email'],
      [{field: 'users_name'}],
      ['photo']
    ]
  }

  get schema() {
    return {
      account_id: {
        type: sequelize.INTEGER,
        user_editable: false,
        field_type: 'hidden'
      },
      provider: {
        type: sequelize.STRING,
        user_editable: false
      },
      service_id: {
        type: sequelize.STRING,
        user_editable: false
      },
      display_name: sequelize.STRING,
      token: {
        type: sequelize.STRING,
        user_editable: false
      },
      users_name: sequelize.JSON,
      email: sequelize.STRING,
      photo: {
        type: sequelize.INTEGER,
        field_type: 'image',
        value_modifier: function (val) {
          return `/uploads/source/${val}.jpg`
        }
      }
    }
  }

  get queryIncludes() {
    return [
      {
        model: this.models.accounts.getModel(),
        attributes: {include: 'created_at', exclude: Object.keys(this.defaultSchema)}
      }
    ]
  }
}

module.exports = Users;
