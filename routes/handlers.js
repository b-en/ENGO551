authors = [ 
	"Ben Trodd",
	"Erick Kohlman"
];

module.exports = { 
	// Index function for root of site
	index : function(req, res) {
		var templateParameters = {
			// Metadata options
			"title"       : "Home",
			"authors"     : authors,
			"description" : "The beginnings of a super wicked dope fly project",
			// Navbar options
			"navFixed" : true,
			"index"    : true,
		};
		res.render('index.html', templateParameters);
	},
}
