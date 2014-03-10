// Create SVG
var width = 1800;
var height = 1000;
var proj = d3.geo.mercator().scale(300).translate([width / 2, 2 * height / 3]);
var path = d3.geo.path().projection(proj);
var t = proj.translate(); // the projection's default translation
var s = proj.scale() // the projection's default scale

var map = d3.select("#mapContainer").append("svg")
	.attr("width", width)
	.attr("height", height)
	.call(d3.behavior.zoom().on("zoom", redraw));

var world = map.append("g").attr("id", "world");

// Load world data
d3.json("/json/world110m.json", function(json) {
	console.log(json);
	// Countries
	world.append("path")
		.datum(topojson.feature(json, json.objects.countries))
			.attr("d", path);	
});

function redraw() {
      // d3.event.translate (an array) stores the current translation from the parent SVG element
      // t (an array) stores the projection's default translation
      // we add the x and y vales in each array to determine the projection's new translation
      var tx = t[0] * d3.event.scale + d3.event.translate[0];
      var ty = t[1] * d3.event.scale + d3.event.translate[1];
      proj.translate([tx, ty]);

      // now we determine the projection's new scale, but there's a problem:
      // the map doesn't 'zoom onto the mouse point'
      proj.scale(s * d3.event.scale);

      // redraw the map
      world.selectAll("path").attr("d", path);
};
