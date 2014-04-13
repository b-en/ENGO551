var tripActive = false;
var $activeTrip;
var countries;
var othersData;
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
var $otherPlannedTripTemplate = $('#otherPlannedTripTemplate').children();
$("#tripTemplate").remove();
$("#plannedTripTemplate").remove();
$('#otherPlannedTripTemplate').remove();
var userTrips = [];
var userPlannedTrips = [];

// Load trips if they exist
if( localStorage.getItem("TravelBuddyMyTrips") != null ){
	// Load options
	var userTripsJSON = localStorage.getItem("TravelBuddyMyTrips");
	var userTrips = $.parseJSON(userTripsJSON);
	console.log(userTrips);
	// Add to trip list
	userTrips.forEach( function ( elem ) { 
		$("#tripList").append($("<li>").append($("<a href=\"#\">" + elem.tripName + "</a>").addClass("tripSelect")));
	})
}
// Draw Map
drawRegionsMap(userTrips, "past");

// Load planned trips if they exist
if( localStorage.getItem("TravelBuddyMyPlannedTrips") != null ){
	// Load options
	var userPlannedTripsJSON = localStorage.getItem("TravelBuddyMyPlannedTrips");
	var userPlannedTrips = $.parseJSON(userPlannedTripsJSON);
	console.log(userPlannedTrips);
	// Add to trip list
	userPlannedTrips.forEach( function ( elem ) { 
		$("#planList").append($("<li>").append($("<a href=\"#\">" + elem.tripName + "</a>").addClass("plannedTripSelect")));
	})
}
// Draw Map
drawRegionsMap(userPlannedTrips, "planned");


// Open past trip details if it's selected from the list
$('.tripSelect').click(function (e) {
	e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#past', $tripTemplate, "past");
	loadTrip(userTrips[checkForTrip(this.innerHTML, userTrips)], "past");
	attachEvents();
	$("#tripName")[0].text = userTrips[checkForTrip(this.innerHTML, userTrips)].tripName;
});

// Open past trip details if it's selected from the list
$('.plannedTripSelect').click(function (e) {
	e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#planned', $plannedTripTemplate, "planned");
	loadTrip(userPlannedTrips[checkForTrip(this.innerHTML, userPlannedTrips)], "planned");
	attachEvents();
	$("#planName")[0].text = userPlannedTrips[checkForTrip(this.innerHTML, userPlannedTrips)].tripName;
});

// Button to add a new past trip
$('#createNewPast').click(function (e) {
	e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#past', $tripTemplate, "past");
	$("#tripName")[0].text = "New Trip";
});

// Button to add a new future trip
$('#createNewPlanned').click(function (e) {
		e.preventDefault();
	if ($activeTrip){
		$activeTrip.remove();
		tripActive = false;
	}
	addTrip('#planned', $plannedTripTemplate, "planned");
	$("#tripName")[0].text = "New Plan";
})

// Date picker
var startDate = new Date(2013,1,1);
var endDate = new Date(2014,1,1);

// Load other user's data
$.ajax({
		type: "get",
		dataType: "json",
		url: "/js/country4.json",
		success: function (data, textStatus, jqXHR) {
			countries = data;
			$.ajax({
					type: "get",
					dataType: "json",
					url: "/js/benOptions.json",
					success: function (data, textStatus, jqXHR) {
							console.log("Heres some shit");
							console.log(data);

							data.forEach( function (elem) {
								elem.past.forEach( function (elem2) {
									addVisited(elem2.destination);
								});
							});
							data.forEach( function (elem) {
								elem.planned.forEach( function (elem2) {
									addVisited(elem2.destination);
								});
							});
							var ndata = google.visualization.arrayToDataTable(countries);

							var options = {
								height: 890,
								width: 1200,
								backgroundColor: "#DFF0F5",
								colorAxis: {
												colors:['#FFFFFF','#FF5900'], 
											},
							};


							var chart3 = new google.visualization.GeoChart(document.getElementById('chart_div3'));
							chart3.draw(ndata, options);
							google.visualization.events.addListener(chart3, 'regionClick', function(eventData)
							{
								var countryName = getText(eventData.region, countries);
								data.forEach( function (elem) {
									elem.past.forEach( function (elem2) {
										if (elem2.destination == countryName){
											// Add past trip details

										}
									});
								});
								data.forEach( function (elem) {
									elem.planned.forEach( function (elem2) {
										if (elem2.destination == countryName){
											// Add planned trip details
											var template = $otherPlannedTripTemplate.clone().appendTo('#others').fadeIn(400);
											$("#otherUserName").val(elem.user.username);
										}
									});
								});
							});
							othersData = data;
					},
					error: function( ) {
						console.log("fuck");
					}
				});
		}
});

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

function addTrip( appendTo, tripTemplate, type ) {
	if( tripActive == false ){
		$activeTrip = tripTemplate.clone().appendTo( appendTo ).fadeIn(400);
		tripActive = true;
	}

	attachEvents( type );
}

function loadTrip ( trip, type ) {
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
	if( type == "past"){
		if( trip.recommendations != null && trip.recommendations != ""){
			$('#recommendations')[0].value = trip.recommendations;
		}
		if( trip.leftoverCurrency === true ){
			$('#leftoverFalse').removeClass("active");
			$('#leftoverTrue').addClass("active");
		}
	} else if (type == "planned"){
		if( trip.travelStyle != null && trip.travelStyle != ""){
			$('#travelStyle')[0].value = trip.travelStyle;
		}
	}
}

function attachEvents ( type ) {
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
		if( type == "past"){
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
			drawRegionsMap(userTrips, "past");
		} else if (type == "planned" ){
			// Get form values
			var newTrip = {
				tripName : $("#newTripName").val(),
				destination : $("#destination").val(),
				startDate : $("#startDate")[0].innerHTML,
				endDate : $("#endDate")[0].innerHTML,
				activities : $("#activities")[0].value,
				travelStyle : $("#travelStyle")[0].value,
			}

			var tripExists = checkForTrip(newTrip.tripName, userPlannedTrips);
			if( tripExists === false ){
				userPlannedTrips.push(newTrip);
				$("#tripName")[0].text = newTrip.tripName;
				$("#planList").append($("<li>").append($("<a href=\"#\">" + newTrip.tripName + "</a>").addClass("plannedTripSelect")));
			} else {
				userPlannedTrips[tripExists] = newTrip;
			}
			console.log(userPlannedTrips);

			// Convert to JSON and save to localStorage
			var userPlannedTripsJSON = JSON.stringify(userPlannedTrips);
			localStorage.setItem("TravelBuddyMyPlannedTrips", userPlannedTripsJSON);
			drawRegionsMap(userPlannedTrips, "planned");
		}
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

function drawRegionsMap(visited, type) {
	$.ajax({
		type: "get",
		dataType: "json",
		url: "/js/country4.json",
		success: function (data, textStatus, jqXHR) {
			if( type == "past"){
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
				chart.draw(ndata, options);
				google.visualization.events.addListener(chart, 'regionClick', function(eventData)
				{
					$('#destination').val(getText(eventData.region, countries));
				});
			} else if (type == "planned"){
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
									colors:['#FFFFFF','#C71E86'],
									minValue:0,
									maxValue:1
								},
					legend: "none"
				};

				var chart2 = new google.visualization.GeoChart(document.getElementById('chart_div2'));
				chart2.draw(ndata, options);

				google.visualization.events.addListener(chart2, 'regionClick', function(eventData)
				{
					$('#destination').val(getText(eventData.region, countries));
				});
			}
		}
	});
}

});
