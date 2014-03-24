$(document).ready(function() {

	if( localStorage.getItem("TravelBuddyOptions") != null ){
		// Load options
		var userOptionsJSON = localStorage.getItem("TravelBuddyOptions"),
			userOptions = $.parseJSON(userOptionsJSON);
		console.log(userOptions);

		// Display existing values on form
		if( userOptions.username != null && userOptions.username != ""){
			$('#username').val(userOptions.username);
		}
		if( userOptions.city != null && userOptions.city != ""){
			$('#city').val(userOptions.city);
		}
		if( userOptions.country != null && userOptions.country != ""){
			$('#country').val(userOptions.country);
		}
	}

	var $save = $("#saveAll"),
		$alertSuccess = $("#alertSuccess"),
		$alertFailure = $("#alertFailure");

	// Hide alerts
	$alertSuccess.hide();
	$alertFailure.hide();

	// Save button
	$save.on("click", function (e) {
		// Get form values
		var userOptions = {
			username : $("#username").val(),
			city : $("#city").val(),
			country : $("#country").val()
		}
		console.log(userOptions);
		// Convert to JSON and save to localStorage
		var userOptionsJSON = JSON.stringify(userOptions);
		localStorage.setItem("TravelBuddyOptions", userOptionsJSON);

		// Check that the values were saved
		if( localStorage.getItem("TravelBuddyOptions") != null ){
			$alertSuccess.fadeIn(400).delay(1000).fadeOut(800);

		} else {
			$alertFailure.fadeIn(400).delay(1000).fadeOut(800);
		}
	});

});