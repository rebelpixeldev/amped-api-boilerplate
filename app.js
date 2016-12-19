/**
 * Module dependencies.
 */
const
  AmpedActivityLog    = require('./app/utils/AmpedActivityLog'),
  AmpedAuthorization  = require('./app/utils/AmpedAuthorization'),
  AmpedSocket         = require('./app/utils/AmpedSocket'),
  AmpedConnector      = require('./app/utils/AmpedConnector'),
  AmpedPassport       = require('./app/utils/AmpedPassport'),
  ampedFeedback       = require('./app/utils/AmpedFeedback'),
  bodyParser          = require('body-parser'),
  compression         = require('compression'),
  errorHandler        = require('errorhandler'),
  express             = require('express'),
  expressValidator    = require('express-validator'),
  flash               = require('express-flash'),
  http                = require('http'),
  logger              = require('morgan'),
  path                = require('path'),
  session             = require('express-session'),
  swig                = require('swig');

const
  MongoStore = require('connect-mongo')(session);

/**
 * Create Express server.
 */
const
  app             = express(),
  server          = http.createServer(app),
  io              = require('socket.io')(server),
  socket          = new AmpedSocket(io);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.engine('html', swig.renderFile);
app.set("view engine", "html");
app.set('views', path.join(__dirname, '/app/views/'));
app.use(express.static(path.join(__dirname, 'pub')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/i18n', express.static(path.join(__dirname, 'i18n')));
app.use(compression());

// app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(expressValidator());

// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: 'abc123',
//   store: new MongoStore({
//     url: 'mongodb://localhost:27017/rebelpixel',
//     autoReconnect: true
//   })
// }));


// @TODO think about how to clean this shit up....
app.use(ampedFeedback({token : true}));

AmpedConnector.buildModels(app, socket);

app.use(AmpedConnector.databaseMiddleware(app, socket));
new AmpedPassport(app, socket);
app.use(AmpedAuthorization.middleware());


app.use(AmpedActivityLog.middleware(socket, {}));
app.use(AmpedConnector.crudRouteMiddleware(app, socket));
// @TODO down to here....


// app.use((req, res, next) => {
//     req.logActivity('Test', 'This is a description', {some:'data'});
//   next();
// })


// app.use(flash());
/**
 * Error Handler.
 */
app.use(errorHandler());
require('./app/Router')(app, socket, path.join(__dirname, 'app/controllers'));

/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
