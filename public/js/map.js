var tripActive = false;
var $activeTrip;
var countries;

// New map
google.load('visualization', '1', {'packages': ['geochart']});

$(document).ready(function() {

// Tabs for Past Travels and Planned Travels
$('#pastTab a').click(function (e) {
	e.preventDefault();
	$(this).tab('show');
});
$('#plannedTab a').click(function (e) {
	e.preventDefault();
	$(this).tab('show');
});

var $tripTemplate = $("#tripTemplate").children();
var $plannedTripTemplate = $("#plannedTripTemplate").children();
$("#tripTemplate").remove();
$("#plannedTripTemplate").remove();
var userTrips = [];

// Load trips if they exist
if( localStorage.getItem("TravelBuddyMyTrips") != null ){
	// Load options
	var userTripsJSON = localStorage.getItem("TravelBuddyMyTrips"),
		userTrips = $.parseJSON(userTripsJSON);
	console.log(userTrips);
	// Add to trip list
	userTrips.forEach( function ( elem ) { 
		$("#tripList").append($("<li>").append($("<a href=\"#\">" + elem.tripName + "</a>").addClass("tripSelect")));
	})
	// Draw Map
	drawRegionsMap(userTrips);
}

// Open past trip details if it's selected from the list
$('.tripSelect').click(function (e) {
	e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#past', $tripTemplate);
	loadTrip(userTrips[checkForTrip(this.innerHTML, userTrips)]);
	attachEvents();
	$("#tripName")[0].text = userTrips[checkForTrip(this.innerHTML, userTrips)].tripName;
});

// Button to add a new past trip
$('#createNewPast').click(function (e) {
	e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#past', $tripTemplate);
	$("#tripName")[0].text = "New Trip";
});

// Button to add a new future trip
$('#createNewPlanned').click(function (e) {
		e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#planned', $plannedTripTemplate);
	$("#tripName")[0].text = "New Plan";
})

// Date picker
var startDate = new Date(2013,1,1);
var endDate = new Date(2014,1,1);

function checkForTrip (tripName, existing) {
	var index;
	var tripExists = false;
	for( var i = 0; i < existing.length; i++ ){
		if( existing[i].tripName == tripName ){
			index = i;
			tripExists = true;
			console.log("Trip exists");
		}
	}

	if(tripExists == true){
		return index;
	} else {
		console.log("Not found");
		return tripExists;
	}
}

function addTrip( appendTo, tripTemplate ) {
	if( tripActive == false ){
		$activeTrip = tripTemplate.clone().appendTo( appendTo ).fadeIn(400);
		tripActive = true;
	}

	attachEvents();
}

function loadTrip ( trip ) {
	// Display existing values on form
	if( trip.tripName != null && trip.tripName != ""){
		$('#newTripName').val(trip.tripName);
	}
	if( trip.destination != null && trip.destination != ""){
		$('#destination').val(trip.destination);
	}
	if( trip.startDate != null && trip.startDate != ""){
		$('#startDate')[0].innerHTML = trip.startDate;
	}
	if( trip.endDate != null && trip.endDate != ""){
		$('#endDate')[0].innerHTML = trip.endDate;
	}
	if( trip.activities != null && trip.activities != ""){
		$('#activities')[0].value = trip.activities;
	}
	if( trip.recommendations != null && trip.recommendations != ""){
		$('#recommendations')[0].value = trip.recommendations;
	}
	if( trip.startDate != null && trip.startDate != ""){
		$('#startDate')[0].innerHTML = trip.startDate;
	}
	if( trip.leftoverCurrency === true ){
		$('#leftoverFalse').removeClass("active");
		$('#leftoverTrue').addClass("active");
	}
}

function attachEvents () {
	$('#dp4').datepicker()
	.on('changeDate', function(ev){
		if (ev.date.valueOf() > endDate.valueOf()){
			$('#alert').show().find('strong').text('The start date can not be greater then the end date');
		} else {
			$('#alert').hide();
			startDate = new Date(ev.date);
			$('#startDate').text($('#dp4').data('date'));
		}
		$('#dp4').datepicker('hide');
	});

	$('#dp5').datepicker()
	.on('changeDate', function(ev){
		if (ev.date.valueOf() < startDate.valueOf()){
			$('#alert').show().find('strong').text('The end date can not be less then the start date');
		} else {
			$('#alert').hide();
			endDate = new Date(ev.date);
			$('#endDate').text($('#dp5').data('date'));
		}
		$('#dp5').datepicker('hide');
	});

	$("#save").on("click", function (e) {
		// Determine active privacy button
		var currency;
		if ( $('#leftoverFalse').hasClass('active') ){
			currency = false;
		} else {
			currency = true;
		}

		// Get form values
		var newTrip = {
			tripName : $("#newTripName").val(),
			destination : $("#destination").val(),
			startDate : $("#startDate")[0].innerHTML,
			endDate : $("#endDate")[0].innerHTML,
			activities : $("#activities")[0].value,
			recommendations : $("#recommendations")[0].value,
			leftoverCurrency : currency
		}

		// Check if this is a new trip or one that needs to be upated. Returns either false of the index
		var tripExists = checkForTrip(newTrip.tripName, userTrips);
		if( tripExists === false ){
			userTrips.push(newTrip);
			$("#tripName")[0].text = newTrip.tripName;
			$("#tripList").append($("<li>").append($("<a href=\"#\">" + newTrip.tripName + "</a>").addClass("tripSelect")));
		} else {
			userTrips[tripExists] = newTrip;
		}
		console.log(userTrips);

		// Convert to JSON and save to localStorage
		var userTripsJSON = JSON.stringify(userTrips);
		localStorage.setItem("TravelBuddyMyTrips", userTripsJSON);
		drawRegionsMap(userTrips);

		/*
		// Check that the values were saved
		if( localStorage.getItem("TravelBuddyMyTrips") != null ){
			$alertSuccess.fadeIn(400).delay(1000).fadeOut(800);
		} else {
			$alertFailure.fadeIn(400).delay(1000).fadeOut(800);
		}
		*/
	});
}

function getText( code, countries ){
	for( var i=0; i < countries.length; i++){
		if( countries[i][0] == code){
			return countries[i][1];
		}
	}
}

function addVisited ( countryName ){
	for(var i = 0; i < countries.length; i++){
		if( countryName == countries[i][1]){
			countries[i][2] = countries[i][2] + 1;
		}
	}
}

function drawRegionsMap(visited) {
	$.ajax({
		type: "get",
		dataType: "json",
		url: "/js/country4.json",
		success: function (data, textStatus, jqXHR) {
			countries = data;
			visited.forEach( function (elem) {
				addVisited(elem.destination);
			})
			var ndata = google.visualization.arrayToDataTable(countries);


			var options = {
				height: 890,
				width: 1200,
				backgroundColor: "#DFF0F5",
				colorAxis: {
								colors:['#FFFFFF','#1EC75F'],
								minValue:0,
								maxValue:1
							},
				legend: "none"
			};



			var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
			var chart2 = new google.visualization.GeoChart(document.getElementById('chart_div2'));
			
			chart.draw(ndata, options);
			chart2.draw(ndata, options);

			google.visualization.events.addListener(chart, 'regionClick', function(eventData)
			{
				$('#destination').val(getText(eventData.region, countries));
			});
		}
	});
};

});
