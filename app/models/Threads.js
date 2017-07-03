'use strict';
const
	AmpedModel  = require('amped-api').get('AmpedModel'),
	sequelize   = require('sequelize');

class Threads extends AmpedModel {

	constructor(app, socket) {
		super(app, socket);
		this.app = app;
	}

	addRelations(models) {
		this.models = models;
		models.threads.getModel().belongsTo(models.users.getModel(), {foreignKey: 'amp_user_id'});
	}

	get schema() {
		return {
			amp_user_id : sequelize.INTEGER,
			title : sequelize.STRING,
			description : sequelize.STRING
		}
	}

	get crudForm() {
		return [
			['title'],
			['description']
		]
	}

	get headerFields() {
		return {
			'Title': 'title',
			'Description': 'description',
			'Created': 'created_at'
		}
	}
	//
	get queryIncludes() {
		return [
			{
				model: this.models.users.getModel(),
				attributes: ['id', 'display_name'],
				include : [{
					model: this.models.uploads.getModel(),
					attributes: ['id', 'filename', 'extension', 'title', 'created_at']
				}]
			},

		]
	}

}

module.exports = Threads;
