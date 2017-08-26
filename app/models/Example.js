'use strict';
const
	AmpedModel  = require('amped-api').get('AmpedModel'),
	sequelize = require('sequelize');

class Example extends AmpedModel {

	constructor(app, socket) {
		super(app, socket);
		this.app = app;
	}

	addRelations(models) {
		this.models = models;
	}

	get schema() {
		return {
			title: sequelize.STRING,
			description: sequelize.STRING
		}
	}


}

module.exports = Example;
