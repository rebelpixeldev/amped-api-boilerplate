const config = {
  errors : {
    'incorrect-password' :{
      code : 1000,
      message : 'Password Incorrect'
    }
  },
  bcrypt : {
    saltRounds  :10
  },
  routing : {
    noAuth : ['/', '/login', '/register', '/reset' ]
  }
};

// @TODO make this mor comprehensive with regexp
config.routing.isPublic = (url) => {
    return config.routing.noAuth.indexOf(url) !== -1 ||
            url.indexOf('/uploads/source') === 0 ||
            url.indexOf('/uploads/thumb') === 0 ||
            url.indexOf('/auth/google') === 0;
}
config.errors.getError = (key) => {
  //@TODO can add i18n translations here for message
    return config[key];
};

module.exports = config;
