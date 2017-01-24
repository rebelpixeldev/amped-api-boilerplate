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
    logging : true,
    define: {
      underscored: true
    }
  },
  passport : {
    google : {
      clientID: '900264263-3nqlusqgu014h4mb83vo39gdgt2orie4.apps.googleusercontent.com',
      clientSecret: '5BGqz2HWelkU0heJn2QQXMtn',
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
  routing : {
    noAuth : ['/', '/login', '/register', '/reset' ]
  },
  email : {
    mandrillKey : 'HXpT-qveJJv66kY4ToyCpQ',
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
    baseDir: path.join(__dirname, '../uploads'),
    thumbDir: path.join(__dirname, '../uploads/thumb'),
    sourceDir: path.join(__dirname, '../uploads/source'),
    tempDir: path.join(__dirname, '../uploads/tmp')
  },
  urls : {
    api : {
      protocol : 'http',
      host : 'localhost',
      port : '3000'
    },
    site : {
      protocol : 'http',
      host : 'localhost',
      port : '3000'
    }
  }
};

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
    return config.routing.noAuth.indexOf(url) !== -1 ||
            url.indexOf('/setpassword') === 0 ||
            url.indexOf('/resetpassword') === 0 ||
            url.indexOf('/logout') === 0 ||
            url.indexOf('/user/invite-accept') === 0 ||
            url.indexOf('/uploads/source') === 0 ||
            url.indexOf('/uploads/thumb') === 0 ||
            url.indexOf('/auth/google') === 0;
}
config.errors.getError = (key) => {
  //@TODO can add i18n translations here for message
    return config[key];
};

module.exports = config;
