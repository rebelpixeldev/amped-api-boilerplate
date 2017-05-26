const config = {
	urls: {
		api: {
			protocol: 'http',
			host: 'api.amped.rebelpixel.ca',
			port: ''
		},
		site: {
			protocol: 'http',
			host: 'amped.rebelpixel.ca',
			port: ''
		}
	},
	passport : {
		google : {
			strategyOpts : {
				clientID: '699923594827-7ovc9n05ueppmue04vvb1d5fg0u41v2i.apps.googleusercontent.com',
				clientSecret: 'E-8UKJJR701ca-jthsGPk2N5',
				callbackURL: 'http://api.amped.rebelpixel.ca/auth/google/callback',
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
				callbackURL: 'http://api.amped.rebelpixel.ca/auth/facebook/callback',
				profileFields   : ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'picture.type(large)'],
				passReqToCallback: true
			},
			authenticateOpts : {
				scope : ['public_profile', 'email']
			}
		}
	},
	db : {
		table : 'amped_admin',
		host : 'amped-admin-demo.cgdpjn01zpv6.ca-central-1.rds.amazonaws.com',
		type : 'postgres',
		user : 'rebelpixel',
		port : 5432,
		password : 'Dash111!',
		logging : console.log,
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
