'use strict';
const
	AmpedModel  = require('amped-api').get('AmpedModel'),
	sequelize   = require('sequelize'),
	ThreadFactory   = require('../factories/ThreadFactory');

class Threads extends AmpedModel {

	constructor(app, socket) {
		super(app, socket);
		this.app = app;
	}

	addRelations(models) {
		this.models = models;
		models.threads.getModel().belongsTo(models.users.getModel(), {foreignKey: 'amp_user_id'});
		models.threads.getModel().hasOne(models.threadfavorites.getModel(), {foreignKey: 'amp_thread_id'});
		models.threads.getModel().hasMany(models.threadcomments.getModel(), {foreignKey: 'amp_thread_id'});
	}

	modifyGetData(req, data){
		const isSingle = typeof data.reduce === 'undefined';
		if ( data === null )
			return data;
		if ( isSingle )
			data = [data];

		data = ThreadFactory.commentsToCommentCount(
			ThreadFactory.isFavorite(data)
		);

		return isSingle ? data[0] : data;

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

	getCreateMessage(data){
		return `Discussion has been created`;
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
	getQueryIncludes(user, params) {
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
			},
			{
				model : this.models.threadfavorites.getModel(),
				attributes : [
					'id', 'amp_user_id', 'amp_thread_id'
				],
				required: false,
				where : { 'amp_user_id' : user.id  }
				// attributes : [sequelize.literal('(SELECT COUNT(*) AS comment_count FROM "threadcomments" WHERE "Orders"."CustomerId" = "Customer"."id"')]
			}

		]
	}

}

module.exports = Threads;
