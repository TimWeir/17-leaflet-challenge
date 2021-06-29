url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var quakes = L.layerGroup();


// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  "Light Map": lightmap
};

// Create an overlayMaps object to hold the bikeStations layer
var overlayMaps = {
  "Earthquakes": quakes
};

// Create the map object with options
var map = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 5,
  //layers: [lightmap]
  layers: [lightmap, quakes]
});

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);



// Perform an API call to get station information.
d3.json(url, function(data) {
  console.log(data);
  function markerSize(magnitude) {
    return magnitude * 3;
  }

  function markerColor(depth) {
    switch(true) {
      case depth > 90:
        return "red";
      case depth > 80:
        return "orangered";
      case depth > 70:
        return "orange";
      case depth > 60:
        return "gold";
      case depth > 50:
        return "yellow";
      case depth > 40:
        return "lightgreen";
      default:
        return "green";
    }
  }

  L.geoJSON(data, {
    pointToLayer: function(feature, location) {
      return L.circleMarker(location, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
      });
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: "+ feature.properties.place + "</h3><hr><p>Date: " + new Date(feature.properties.time) 
                      + "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(quakes);

  quakes.addTo(map);

});

