// initialize the map on the "map" div with a given center and zoom
const map = L.map("map", {
    center: [47.119446, 2.666402],
    zoom: 5
});

// select the tile layer provider. In this case it's OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// create a marker cluster group for photo locations
var markers = L.markerClusterGroup();

// load the GeoJSON data and add it to the marker cluster group
var geojsonLayer = new L.geoJson.ajax("https://raw.githubusercontent.com/jaredczn/europe-map/master/photo_metadata.geojson", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.group + "</br>" +
            feature.properties.filename + "<br />" +
            feature.properties.exif_datetime_original
        );
    }
});

geojsonLayer.on('data:loaded', function() {
    markers.addLayer(geojsonLayer);
    map.addLayer(markers);
});