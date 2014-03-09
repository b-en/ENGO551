// Module dependencies.
var express = require('express');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('env', process.env.NODE_ENV || 'development');

// Configuration
app.configure( function() {
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'ezMode' }));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

// Error Handling
app.use(function(req, res) { 
	res.send('404: Page not Found', 404);
});
app.use(function(error, req, res, next) {
	res.status(err.status || 500);
	res.send('500: Internal Server Error', 500);
});

// Routes
require('./routes/handlers');

app.listen(app.get('port'), function(){
	console.log('Listening on port ' + app.get('port') + 
		'. Go to http://localhost:' + app.get('port') + '/');
});