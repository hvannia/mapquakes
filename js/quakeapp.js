// all earthquakes past 7 days geojson data from usgs

var mapZoomLevel = 12;
var gData=[];
 
 const link ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 
 d3.json(link, function(data) {
    gData=data;
    console.log(data); 
    createFeatures(data.features);
});


function createFeatures(earthquakeFeatures){
    /*by passing a pointToLayer function in a GeoJSON options object when creating the GeoJSON layer. This function is passed a LatLng and should return an instance of ILayer, in this case likely a Marker or CircleMarker.

  */

    let r=0;
    let col=""; // red-orang

    earthquakes = L.geoJson(earthquakeFeatures, {
        style: function(feature) {
            if (feature.properties.mag >=5){
                r=12;
                col="#ff3b00";
            }else if (feature.properties.mag >4 && feature.properties.mag<5 ){
                r=10;
                col="#ff7b00";
            }else if(feature.properties.mag >3 && feature.properties.mag<4){
                r=8;
                col="#ffd000";
            }else if (feature.properties.mag >2 && feature.properties.mag<3){
                r=6;
                col="#f2ff00";
            }else if (feature.properties.mag >1 && feature.properties.mag<2){
                r=4;
                col="#9dff00";
            }else{
                r=2;
                col="#00ffa9";
            }
            return {
                color: col,
                radius:r
            };
         },
        pointToLayer : function(feature, latlng) {
            
            return new L.CircleMarker(latlng, {
                color: col,
                radius: r, 
                weight: 1,
                fillOpacity: 0.75
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(` <b>${feature.properties.place}</b> <br /> magnitude: ${feature.properties.mag} `);
        }
    });

 createMap(earthquakes); 
}
  
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  

      var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "satellite": satellitemap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("quakemap", {
      center: [
        37.09, -95.71
      ],
      zoom: 2,
      layers: [satellitemap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  