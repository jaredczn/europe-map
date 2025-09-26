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
var geojsonLayer = new L.geoJson.ajax("https://raw.githubusercontent.com/jaredcza/publicsandbox/7851fe5fb4fd97473cda56835886db2c6ee8010a/media_metadata.geojson", {
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

// create another marker cluster group for swarm check-ins
var swarmMarkers = L.markerClusterGroup();

// load the GeoJSON data for swarm check-ins and add it to the swarm marker cluster group
var swarmGeojsonLayer = new L.geoJson.ajax("https://raw.githubusercontent.com/jaredcza/publicsandbox/main/swarm_checkins.geojson", {
	onEachFeature: function (feature, layer) {
		layer.bindPopup(
			feature.properties.venue + "</br>" +
			feature.properties.address + "<br />"
		);
	}
});

// add the swarm marker cluster group to the map
swarmGeojsonLayer.on('data:loaded', function() {
	swarmMarkers.addLayer(swarmGeojsonLayer);
	map.addLayer(swarmMarkers);
});