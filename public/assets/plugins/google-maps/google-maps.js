/**
 * Google maps
 */

function initMap() {
  var myLatLng = {lat: 44.5403, lng: -78.5463};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 8
  });

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    title: 'Hello World!'
  });
}
initMap();