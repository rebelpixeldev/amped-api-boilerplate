'use strict';
const
	AmpedModel  = require('amped-api').get('AmpedModel'),
	sequelize   = require('sequelize');

class Threadfavorites extends AmpedModel {

	constructor(app, socket) {
		super(app, socket);
		this.app = app;
	}

	modifyGetData(req, data){

		if ( typeof data.reduce === 'undefined' )
			return data;

		return data.reduce(( ret, d ) => {
			const comments = d.thread.threadcomments;
			d.thread.comment_count = comments.length;

			delete d.thread.threadcomments;
			return [...ret, d];
		}, []);
	}

	addRelations(models) {
		this.models = models;
		models.threadfavorites.getModel().belongsTo(models.users.getModel(), {foreignKey: 'amp_user_id'});
		models.threadfavorites.getModel().belongsTo(models.threads.getModel(), {foreignKey: 'amp_thread_id'});
	}

	get schema() {
		return {
			amp_user_id : sequelize.INTEGER,
			amp_thread_id : sequelize.INTEGER,
		}
	}

	get getByUser(){
		return true;
	}

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
				model : this.models.threads.getModel(),
				include : [{
					model : this.models.threadcomments.getModel(),
					attributes : [
						'id'
					]
					// attributes : [sequelize.literal('(SELECT COUNT(*) AS comment_count FROM "threadcomments" WHERE "Orders"."CustomerId" = "Customer"."id"')]
				}]
			}
		]
	}

}

module.exports = Threadfavorites;
