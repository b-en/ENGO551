$(document).ready(function() {

	var $save = $("#saveAll"),
		$alertSuccess = $("#alertSuccess"),
		$alertFailure = $("#alertFailure");

	// Hide alerts
	$alertSuccess.hide();
	$alertFailure.hide();

	// Load options if they exist
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
		if( userOptions.email != null && userOptions.email != ""){
			$('#email').val(userOptions.email);
		}
		// Display saved privacy option
		if( userOptions.email != null ){
			$('#public').removeClass('active');
			$('#' + userOptions.sharing).addClass('active');
		}
	}

	// Save button
	$save.on("click", function (e) {
		// Determine active privacy button
		var shareOption;
		if ( $('#public').hasClass('active') ){
			shareOption = "public";
		} else if ( $('#group').hasClass('active') ){
			shareOption = "group";
		} else {
			shareOption = "private";
		}

		// Get form values
		var userOptions = {
			username : $("#username").val(),
			city : $("#city").val(),
			country : $("#country").val(),
			email : $("#email").val(),
			sharing: shareOption,
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