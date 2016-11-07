'use strict';
const
    AmpedModel  = require('./AmpedModel'),
    sequelize   = require('sequelize');

class Users extends AmpedModel{

    constructor(app, socket){
        super(app, socket);
        this.app = app;
    }

    get schema(){
        return {
          provider      : {
            type : sequelize.STRING,
            user_editable : false
          },
          service_id    : {
            type : sequelize.STRING,
            user_editable : false
          },
          display_name  : sequelize.STRING,
          token         : {
            type : sequelize.STRING,
            user_editable : false
          },
          users_name    : sequelize.JSON,
          email         : sequelize.STRING,
          photo         : sequelize.STRING
        }
    }

    get buildCrudRoutes(){return true;}
}

module.exports = Users;
