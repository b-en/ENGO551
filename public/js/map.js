$(document).ready(function() {

var map;

function initialize() {
	var myLatlng = new google.maps.LatLng(51.079529, -114.132446);
	var myOptions = {
		zoom: 2,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: true
	};

	map = new google.maps.Map(document.getElementById('mapCanvas'), myOptions);
};

google.maps.event.addDomListener(window, 'load', initialize);

// Tabs for Past Travels and Planned Travels
$('#past a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});
$('#planned a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})


});