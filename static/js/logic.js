//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Find info in console
d3.json(url).then(function(data) {
  console.log(data)
});



// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});


// basemap
let baseMaps = {
    "streets": streets
};

// earthquake layergroup 
let earthquake_data = new L.LayerGroup();


//fill overlay
let overlays = {
    "Earthquakes": earthquake_data,
   
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//styleInfo function variable
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), 
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth > -10 & depth <= 10) return"green";
    else if (depth > 10 & depth <= 30) return "lightgreen";
    else if (depth > 30 & depth <= 50) return "beige";
    else if (depth > 50 & depth <= 70) return "orange";
    else if (depth > 70 & depth <= 90) return "pink";
    else if (depth > 90) return "red";
    else return "blue";
};

//define a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*5;
};


//Run 
d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
     L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.properties.place); 
        },
        style: styleInfo //style the CircleMarker with the styleInfo function as defined above
    }).addTo(earthquake_data); // add the earthquake data to the earthquake_data layergroup / overlay
    earthquake_data.addTo(myMap);
   
});

//Legend
cats = ['-10-10','10-30','30-50','50-70','70-90','90+'];
colors = ['green', 'lightgreen', 'beige', 'orange', 'pink', 'red', 'blue']

var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {

var div = L.DomUtil.create('div', 'info legend');

for (var i = 0; i < cats.length; i++) {
  var item = `<li style='background: ${colors[i]}    ${cats[i]}<br>`
  // console.log(item);
  div.innerHTML += item
  }return div };legend.addTo(myMap);

  
  
  