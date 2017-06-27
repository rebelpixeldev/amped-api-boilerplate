/**
 * Module dependencies.
 */
const
	bodyParser          = require('body-parser'),
	compression         = require('compression'),
	config              = require('./app/config/config'),
	errorHandler        = require('errorhandler'),
	express             = require('express'),
	expressValidator    = require('express-validator'),
	flash               = require('express-flash'),
	formidable          = require("formidable"),
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
	app = express(),
	server = http.createServer(app),
	io = require('socket.io')(server);
	// socket = new AmpedSocket(io);


const amped = require('amped-api').setup(config, io, {});


const
	AmpedAcl            = amped.AmpedAcl,
	AmpedActivityLog    = amped.AmpedActivityLog,
	AmpedAuthorization  = amped.AmpedAuthorization,
	AmpedConnector      = amped.AmpedConnector,
	AmpedMiddleware     = amped.AmpedMiddleware,
	AmpedPassport       = amped.AmpedPassport,
	socket              = amped.socket;


/**
 * Express configuration.
 */

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, authorization, foo');
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	} else {
		next();
	}
});


app.set('port', process.env.PORT || 4000);
app.engine('html', swig.renderFile);
app.set("view engine", "html");
app.set('views', path.join(__dirname, '/app/views/'));
app.use(express.static(path.join(__dirname, 'pub')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/i18n', express.static(path.join(__dirname, 'i18n')));
app.use(compression());

// app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
app.use(bodyParser.json());


// @TODO think about how to clean this shit up....
// add the amped object and params to the req object
app.use(AmpedMiddleware.params());

// Add feedback to the req object so all api responses are the same format
app.use(AmpedMiddleware.feedback({token: true}));

// Build all the models and connect to the database
console.log(path.join(__dirname, 'app/models'));
AmpedConnector.buildModels(app, socket, path.join(__dirname, 'app/models'));

// Add the database models to the req object
app.use(AmpedConnector.databaseMiddleware(app, socket));

AmpedAcl.buildACL();

// Connect passport and build the strategies
new AmpedPassport(app, socket);

// add all the middleware that has to do with getting the user info
app.use(AmpedAuthorization.middleware);

// Add the activity log to the req object
app.use(AmpedActivityLog.middleware(socket, {}));

// Add all the crud routes that are built from the model
app.use(AmpedConnector.crudRouteMiddleware(app, socket));

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
