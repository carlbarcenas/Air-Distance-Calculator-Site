// Function to calculate air distance using Haversine formula
// Credit to: movable-type.co.uk/scripts/latlong.html for the function
function getAirDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // radius of the earth in metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
}

// Calculate Button
const calculate = document.querySelector('#calculateBtn');
calculate.addEventListener('click', () => {
    // Get input values from textbox
    var lat1 = document.getElementById('lat1').value; // Latitude is -90 to 90 deg
    var lon1 = document.getElementById('lon1').value; // Longitude is -180 to 180 deg
    var lat2 = document.getElementById('lat2').value;
    var lon2 = document.getElementById('lon2').value;

    // Calculate result and output
    var result = getAirDistance(lat1, lon1, lat2, lon2).toFixed(2);
    var outputText = document.querySelector('#output');
    outputText.textContent = `Calculated Air Distance: ${result}km`;
})

// MAP SECTION: --------------------------------------------------------------------------------------
// Initialize Map
var myMap = L.map('map', {center:[38, -77], zoom:12, zoomControl:false});
var lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
myMap.addLayer(lyrOSM);

// Initialize Geocoder
L.Control.geocoder().addTo(myMap);

myMap.on('geosearch/showlocation', function(result) {
    console.log(result.x, result.y);
})

// TODO: Get Lat / Long of Address
/*
document.addEventListener('click', (e) => {
    console.log(myMap.getBounds().getCenter()); // This only gets the center of map lat and long
})
*/
