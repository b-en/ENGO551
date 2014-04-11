var tripActive = false;

$(document).ready(function() {

var map;
var theme = [{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#fffffa"}]},{"featureType":"water","stylers":[{"color":"#46bcec"},]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"lightness":40}]}];

function initialize () {
	var myLatlng = new google.maps.LatLng(21.079529, -114.132446);
	var myOptions = {
		zoom: 2,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: true,
		styles: theme
	};

	map = new google.maps.Map(document.getElementById('mapCanvas'), myOptions);
};

google.maps.event.addDomListener(window, 'load', initialize);

// Tabs for Past Travels and Planned Travels
$('#past a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});
$('#planned a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

var $tripTemplate = $("#tripTemplate").children();
$("#tripTemplate").remove();

var userTrips = [];

// Button to add a new past trip
$('#createNewPast').click(function (e) {
	e.preventDefault();
	addTrip('#past', $tripTemplate);

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
			reccomendations : $("#recommendations")[0].value,
			leftoverCurrency : currency
		}

		// Check if this is a new trip or one that needs to be upated. Returns either false of the index
		var tripExists = checkForTrip(newTrip.tripName, userTrips);
		if( tripExists === false ){
			userTrips.push(newTrip);
			$("#tripName")[0].text = newTrip.tripName;
		} else {
			userTrips[tripExists] = newTrip;
		}
		console.log(userTrips);

		// Convert to JSON and save to localStorage
		var userTripsJSON = JSON.stringify(userTrips);
		localStorage.setItem("TravelBuddyMyTrips", userTripsJSON);

		/*
		// Check that the values were saved
		if( localStorage.getItem("TravelBuddyMyTrips") != null ){
			$alertSuccess.fadeIn(400).delay(1000).fadeOut(800);
		} else {
			$alertFailure.fadeIn(400).delay(1000).fadeOut(800);
		}
		*/
	});
});

});

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
		tripTemplate.clone().appendTo( appendTo ).fadeIn(400);
		tripActive = true;
	}
};