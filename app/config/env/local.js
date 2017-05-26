const config = {
	urls: {
		api: {
			protocol: 'http',
			host: 'localhost',
			port: '4000'
		},
		site: {
			protocol: 'http',
			host: 'localhost',
			port: '3000'
		}
	},
	passport: {
		google: {
			strategyOpts : {
				clientID: '699923594827-p83mqpups4mcohsi4q9r0h9l4tkvnb5b.apps.googleusercontent.com',//'900264263-3nqlusqgu014h4mb83vo39gdgt2orie4.apps.googleusercontent.com',
				clientSecret: '8FKYDPwJnyE1aG01JhKEdG8e',
				callbackURL: '/auth/google/callback',
				session: false,
				passReqToCallback: true
			},
			authenticateOpts : {
				scope: ['profile', 'email']
			}
		},
		facebook: {
			strategyOpts : {
				clientID: 1835120096813740,
				clientSecret: 'dd917a3405a1a637f8c751450dedfe68',
				callbackURL: 'http://localhost:4000/auth/facebook/callback',
				profileFields   : ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'picture.type(large)'],
				passReqToCallback: true
			},
			authenticateOpts : {
				scope : ['public_profile', 'email']
			}

		}
	},
	db: {
		type: 'postgres',
		database : 'postgres',
		host : 'localhost',
		port : 5432,
		user: 'ted',
		password: 'Dash111!',
		logging: console.log,
		define: {
			underscored: true
		}
	},
	email: {
		mandrillKey: 'FEgfJYUv1NJYHnyn9Z1fCA',
		noReply: 'no-reply@rebelpixel.ca',
		noReplyName: 'Amped Admin',
		jwt: {
			secret: 'mandrillsecret',
			expires: 3600,
			issues: 'amped-framework.com'
		}
	},
}

module.exports = config;
