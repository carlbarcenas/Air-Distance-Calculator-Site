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
function removeTransition(e) {
    if(e.propertyName !== 'transform') return; // Skip if not a transform
    this.classList.remove('calculating');
}

// Calculate Button
const calculate = document.querySelector('#calculateBtn');
var outputText = document.querySelector('#output');
calculate.addEventListener('click', () => {
    // Get input values from textbox
    var coordA = document.getElementById('coordA').value.split(',');
    var coordB = document.getElementById('coordB').value.split(',');

    // Calculate result and output
    var result = getAirDistance(parseFloat(coordA[0]), parseFloat(coordA[1]),
        parseFloat(coordB[0]), parseFloat(coordB[1])).toFixed(2);
    outputText.textContent = `Calculated Air Distance: ${result}km`;

    outputText.classList.add('calculating');
})
outputText.addEventListener('transitionend', removeTransition);


// MAP AND ADDRESS LOOKUP: --------------------------------------------------------------------------------------
// Initialize Map
// New York
var startlat = 40.75637123;
var startlon = -73.98545321;

var options = {
    center: [startlat, startlon],
    zoom: 9
}

document.getElementById('addrLat').value = startlat;
document.getElementById('addrLon').value = startlon;

var map = L.map('map', options);
var nzoom = 12;
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'OSM' }).addTo(map);

// Place Marker
var myMarker = L.marker([startlat, startlon], { title: "Coordinates", alt: "Coordinates", draggable: true }).addTo(map).on('dragend', function () {
    var lat = myMarker.getLatLng().lat.toFixed(8);
    var lon = myMarker.getLatLng().lng.toFixed(8);
    var czoom = map.getZoom();
    if (czoom < 18) { nzoom = czoom + 2; }
    if (nzoom > 18) { nzoom = 18; }
    if (czoom != 18) { map.setView([lat, lon], nzoom); } else { map.setView([lat, lon]); }
    document.getElementById('addrLat').value = lat;
    document.getElementById('addrLon').value = lon;
    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
});

function chooseAddr(lat1, lng1) {
    myMarker.closePopup();
    map.setView([lat1, lng1], 18);
    myMarker.setLatLng([lat1, lng1]);
    lat = lat1.toFixed(8);
    lon = lng1.toFixed(8);
    document.getElementById('addrLat').value = lat;
    document.getElementById('addrLon').value = lon;
    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
}

function myFunction(arr) {
    var out = "";
    var i;

    if (arr.length > 0) {
        for (i = 0; i < arr.length; i++) {
            out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " + arr[i].lon + ");return false;'>" + arr[i].display_name + "</div>";
        }
        document.getElementById('results').innerHTML = out;
    }
    else {
        document.getElementById('results').innerHTML = "Sorry, no results...";
    }
}

function addr_search() {
    var inp = document.getElementById("addr");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Set Address Coordinates to A or B
var pointA_btn = document.querySelector('#setA_btn');
var pointB_btn = document.querySelector('#setB_btn');
pointA_btn.addEventListener('click', () => {
    var lat = document.querySelector('#addrLat').value;
    var lon = document.querySelector('#addrLon').value;
    var string = `${lat}, ${lon}`;
    document.querySelector('#coordA').value = string;
})
pointB_btn.addEventListener('click', () => {
    var lat = document.querySelector('#addrLat').value;
    var lon = document.querySelector('#addrLon').value;
    var string = `${lat}, ${lon}`;
    document.querySelector('#coordB').value = string;
})