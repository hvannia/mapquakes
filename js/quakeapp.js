// all earthquakes past 7 days geojson data from usgs

let mapZoomLevel = 12;
let gData=[];
let pData=[];
let legend = L.control({position: 'bottomright'});
const link ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const platesLink="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

function getColor(d) {
    return d > 5? '#ff3b00' : d > 4? '#ff7b00' : d > 3? '#ffd000' : d > 2? '#f2ff00' : d >1 ? '#9dff00': '#00ffa9';
}
function getRadius(d){
    return d > 5? 12 : d > 4? 10 : d > 3? 8 : d > 2? 6 : d >1 ? 4: 3;
}



 d3.json(link, function(data) {
    gData=data;
    console.log(data); 
    d3.json(platesLink, function(pdata) {
        pData=pdata;
        console.log(pdata); 
        createFeatures(data.features, pdata.features);
    });
});



function createFeatures(earthquakeFeatures, platesFeatures){
    let r=0;
    let col=""; 

    earthquakes = L.geoJson(earthquakeFeatures, {
        style: function(feature) {
            return {
                color: getColor(feature.properties.mag),
                radius: getRadius(feature.properties.mag)
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
            layer.bindPopup(` <p style="text-align:center;">
                                <b> <a href="${feature.properties.url}  ">
                                            ${feature.properties.place} </a>
                                 </b> <br />magnitude: ${feature.properties.mag}<br />`);
        }   
    });

    //plates="";
    plates = L.geoJson(platesFeatures,{
        style:function(feature){
            return {
                color:"blue",
                weight: 1.5,
                fillColor: "transparent"
            }
        }
    });

    createMap(earthquakes,plates); 
 
}
  
function createMap(earthquakes,plates) {

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
  

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "satellite": satellitemap
    };

    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Plates": plates
    };
/*14°12'40.3"N 3°32'57.1"W  Bankass, Mali
14.211196, -3.549203*/
    var myMap = L.map("quakemap", {
      center: [
        14.2111, -3.5492
      ],
      zoom: 2,
      layers: [satellitemap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            rscale = [0, 1,2,3, 4, 5];

        for (var i = 0; i < rscale.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(rscale[i] + 1) + '"></i> ' +
                rscale[i] + ( rscale[i + 1] ? '&ndash;' + rscale[i + 1] + '<br>' : '+');
        }
    
        return div;
        };
        legend.addTo(myMap);
  }
  