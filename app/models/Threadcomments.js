'use strict';
const
	AmpedModel  = require('amped-api').get('AmpedModel'),
	AmpedUtil   = require('amped-api').get('AmpedUtil'),
	sequelize   = require('sequelize');

class Threadcomments extends AmpedModel {

	constructor(app, socket) {
		super(app, socket);
		this.app = app;
	}

	addRelations(models) {
		this.models = models;
		models.threadcomments.getModel().belongsTo(models.users.getModel(), {foreignKey: 'amp_user_id'});
	}

	modifyGetData(req, data){
		const params = AmpedUtil.getParams(req);

		if ( typeof params.flat !== 'undefined' && params.flat )
			return data;

		data = JSON.parse(JSON.stringify(data));

		if ( data.constructor !== Array )
			return data;

		const resp = data
			.filter(( comment ) => comment.parent_comment_id === 0 )
			.reduce(( ret, comment ) => {
			    ret[comment.id] = Object.assign({}, comment, {child_comments:[]});
			    return ret;
			}, {});

		data.forEach(( comment ) => {
		    if ( comment.parent_comment_id !== 0 )
		    	resp[comment.parent_comment_id].child_comments.push(comment);
		});

		return Object.keys(resp).map(( id ) => resp[id]);

	}

	customSocketEmit(sockets, evt, data, user){
		console.log('SENDING CUSTOM SOCKETS');

		Object.keys(sockets).forEach(( userId ) => sockets[userId].emit(evt, data));


	}

	get schema() {
		return {
			amp_user_id : sequelize.INTEGER,
			thread_id : sequelize.INTEGER,
			parent_comment_id : sequelize.INTEGER,
			comment : sequelize.STRING
		}
	}

	get crudForm() {
		return [
			['comment']
		]
	}

	get headerFields() {
		return {
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

module.exports = Threadcomments;
