
$(document).ready(function() {

var map;
var theme = [{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#fffffa"}]},{"featureType":"water","stylers":[{"lightness":50}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"lightness":40}]}];

function initialize () {
	var myLatlng = new google.maps.LatLng(51.079529, -114.132446);
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
  e.preventDefault()
  $(this).tab('show')
});
$('#planned a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})


});