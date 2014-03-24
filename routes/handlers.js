var authors = [ 
	"Ben Trodd",
	"Erick Kohlman"
];

module.exports = function (app) { 
	
	// Index function for root of site
	app.get('/index', function (req, res) {
		var templateParameters = {
			// Metadata options
			"title"       : "Home",
			"authors"     : authors,
			"description" : "The main page, for planning trips",
		};
		res.render('mapPage.html', templateParameters);
	});
	app.get('/', function (req, res) {
		var templateParameters = {
			// Metadata options
			"title"       : "Home",
			"authors"     : authors,
			"description" : "The main page, for planning trips",
		};
		res.render('mapPage.html', templateParameters);
	});

	// Options page
	app.get('/options', function (req, res) {
		var templateParameters = {
					// Metadata options
					"title"       : "Options",
					"authors"     : authors,
					"description" : "The options page, for setting preferences",
				};
		res.render('optionsPage.html', templateParameters);
	});

}

