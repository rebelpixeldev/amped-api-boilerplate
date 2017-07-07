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
		models.threads.getModel().hasMany(models.threadcomments.getModel(), {foreignKey: 'amp_thread_id'});
	}

	modifyGetData(req, data){

		if ( typeof data.reduce === 'undefined' )
			return data;

		return data.reduce(( ret, d ) => {
			const comments = d.threadcomments;
			d.comment_count = comments.length;

			delete d.threadcomments;
			return [...ret, d];
		}, []);
	}

	get schema() {
		return {
			amp_user_id : sequelize.INTEGER,
			title : sequelize.STRING,
			description : {
				type : sequelize.STRING,
				field_type : 'textarea'
			}
		}
	}

	get crudForm() {
		return [
			['title'],
			[{field:'description', label: 'Description'}]
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
			{
				model : this.models.threadcomments.getModel(),
				attributes : [
					'id'
				]
				// attributes : [sequelize.literal('(SELECT COUNT(*) AS comment_count FROM "threadcomments" WHERE "Orders"."CustomerId" = "Customer"."id"')]
			}

		]
	}

}

module.exports = Threads;
