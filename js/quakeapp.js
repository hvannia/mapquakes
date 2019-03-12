// all earthquakes past 7 days geojson data from usgs

var mapZoomLevel = 6;
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

    let r=12;
    let col="#FF4500"; // red-orang

    earthquakes = L.geoJson(earthquakeFeatures), {
        style: function(feature) {
            return {
                color: "red",
                radius:14
            };
         },
        pointToLayer: function(feature, latlng) {
            if (feature.properties.mag >4 && feature.properties.mag<5 ){
                r=10;
                col="FF6347";
            }else if(feature.properties.mag >3 && feature.properties.mag<4){
                r=8;
                col="#DAA520";
            }else if (feature.properties.mag >2 && feature.properties.mag<3){
                r=6;
                col="#ADFF2D";
            }else if (feature.properties.mag >1 && feature.properties.mag<2){
                r=4;
                col="#ADFF2D";
            }else{
                r=2;
                col="#90EE90";
            }
            return new L.CircleMarker(latlng, {
                color: col,
                radius: r, 
                weight: 1,
                fillOpacity: 0.5
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.mag);
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
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  