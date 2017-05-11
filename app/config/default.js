const
  path = require('path');


const paths = {

}

const config = {
  site : {
    name : 'Amped Admin'
  },
  db : {
    type : 'postgres',
    user : 'ted',
    password : 'Dash111!',
    logging : console.log,
    define: {
      underscored: true
    }
  },
  url : {
    prefix : '/api'
  },
  passport : {
    google : {
      clientID: '699923594827-p83mqpups4mcohsi4q9r0h9l4tkvnb5b.apps.googleusercontent.com',//'900264263-3nqlusqgu014h4mb83vo39gdgt2orie4.apps.googleusercontent.com',
      clientSecret: '8FKYDPwJnyE1aG01JhKEdG8e',
      callbackURL: '/auth/google/callback',
      session : false,
      passReqToCallback: true
    }
  },
  jwt : {
    secret : 'secret',
    expires : 7200,
    issuer : 'amped-framework.com'
  },
  errors : {
    'login-error' :{
      code : 1000,
      message : 'Username or password is incorrect'
    }
  },
  bcrypt : {
    saltRounds  :10
  },
  email : {
    mandrillKey : 'FEgfJYUv1NJYHnyn9Z1fCA',
    noReply : 'no-reply@rebelpixel.ca',
    noReplyName : 'Amped Admin',
    jwt : {
      secret : 'mandrillsecret',
      expires : 3600,
      issues : 'amped-framework.com'
    }
  },
  uploads: {
    thumb :{
      width : 300,
      height: 300
    },
    sourceFilePath : '/uploads/source',
    thumbFilePath : '/uploads/thumb',
    baseDir: path.join(__dirname, '../../uploads'),
    thumbDir: path.join(__dirname, '../../uploads/thumb'),
    sourceDir: path.join(__dirname, '../../uploads/source'),
    tempDir: path.join(__dirname, '../../uploads/tmp')
  },
  urls : {
    api : {
      protocol : 'http',
      host : 'localhost',
      port : '4000'
    },
    site : {
      protocol : 'http',
      host : 'localhost',
      port : '3000'
    }
  }
};

config.routing = {
	noAuth : [
	    '/',
        `${config.url.prefix}/user/login`,
        `${config.url.prefix}/user/register`,
        `${config.url.prefix}/user/resetpassword`,
        '/auth/google',
        '/auth/google/callback',
        '/uploads/thumb/72.jpg'
    ]
},

Object.keys(config.urls).forEach((name) => {
  const ref = config.urls[name];
  let url = '';
  url += (typeof ref.protocol === 'undefined' ? 'http' : ref.protocol) + '://';
  url += ref.host;
  if ( typeof ref.port !== 'undefined' )
    url += `:${ref.port}`;
  ref.domain = url;
});


// @TODO make this mor comprehensive with regexp
config.routing.isPublic = (url) => {
  return config.routing.noAuth.indexOf(url.split('?')[0]) !== -1;
}
config.errors.getError = (key) => {
  //@TODO can add i18n translations here for message
    return config[key];
};

module.exports = config;
