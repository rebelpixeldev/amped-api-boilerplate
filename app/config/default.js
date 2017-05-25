const
	path = require('path');


const paths = {}

const config = {
	site: {
		name: 'Amped Admin'
	},
	url: {
		prefix: '/api'
	},
	jwt: {
		secret: 'secret',
		expires: 7200,
		issuer: 'amped-framework.com'
	},
	errors: {
		loginerror: {
			code: 1000,
			message: 'Username or password is incorrect'
		}
	},
	bcrypt: {
		saltRounds: 10
	},
	uploads: {
		thumb: {
			width: 300,
			height: 300
		},
		sourceFilePath: '/uploads/source',
		thumbFilePath: '/uploads/thumb',
		baseDir: path.join(__dirname, '../../uploads'),
		thumbDir: path.join(__dirname, '../../uploads/thumb'),
		sourceDir: path.join(__dirname, '../../uploads/source'),
		tempDir: path.join(__dirname, '../../uploads/tmp')
	}
};

config.routing = {
	noAuth: [
		'/config',
		// `${config.url.prefix}/user`,
		`${config.url.prefix}/user/login`,
		`${config.url.prefix}/user/register`,
		`${config.url.prefix}/user/resetpassword`,
		`${config.url.prefix}/user/setpassword`,
		'/auth/google',
		'/auth/google/callback',
		'/auth/facebook',
		'/auth/facebook/callback',
		'/uploads/thumb/72.jpg'
	],
	openRoutes : [
		'/uploads/thumb',
		'/uploads/source'
	]
},


// @TODO make this mor comprehensive with regexp
config.routing.isPublic = (url) => {
	const base = url.split('?')[0];
	const parts = url.split('/');
	return config.routing.noAuth.indexOf(base) !== -1 || config.routing.openRoutes.filter(( route ) => url.indexOf(route) === 0 ).length > 0;
}
config.errors.getError = (key) => {
	//@TODO can add i18n translations here for message
	return config[key];
};

module.exports = config;
