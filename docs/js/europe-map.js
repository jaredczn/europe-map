// initialize the map
const map = L.map("map", {
	center: [47.119446, 2.666402],
	zoom: 5
});

// base map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// --- Marker cluster groups ---
var photoMarkers = L.markerClusterGroup();
var checkinMarkers = L.markerClusterGroup();

// --- Material icon paths (from Material Symbols) ---
const PATH_PHOTO_CAMERA = "M12 9a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3a3 3 0 0 0-3-3zm7-3h-3.17l-1.24-1.65c-.19-.25-.49-.35-.79-.35H10.2c-.3 0-.6.1-.79.35L8.17 6H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z";
const PATH_LOCATION_ON = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

// --- Helper: build circular SVG icons with padding + white border ---
function createSvgIcon(pathD, circleColor, iconColor) {
	return L.divIcon({
		className: "custom-marker",
		html: `
			<div class="marker-wrapper">
			<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="11.5" fill="${circleColor}" stroke="white" stroke-width="2" />
				<g transform="scale(0.75) translate(4,4)">
				<path d="${pathD}" fill="${iconColor}"/>
				</g>
			</svg>
			</div>
		`,
		iconSize: [34, 34],
		iconAnchor: [17, 17],
		popupAnchor: [0, -17]
	});
}

// --- First dataset: Photo metadata ---
var geojsonLayerPhotos = new L.geoJson.ajax("https://raw.githubusercontent.com/jaredczn/europe-map/master/photo_metadata.geojson", {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: createSvgIcon(PATH_PHOTO_CAMERA, "#64b5f6", "#ffffff") // light blue circle
		});
	},
	onEachFeature: function (feature, layer) {
		layer.bindPopup(
			feature.properties.group + "</br>" +
			feature.properties.filename + "<br />" +
			feature.properties.exif_datetime_original
		);

		// Popup hover effect
		layer.on("popupopen", function () {
			const iconEl = layer.getElement();
			if (iconEl) iconEl.classList.add("popup-open");
		});
		layer.on("popupclose", function () {
			const iconEl = layer.getElement();
			if (iconEl) iconEl.classList.remove("popup-open");
		});
	}
});

geojsonLayerPhotos.on('data:loaded', function () {
	photoMarkers.addLayer(geojsonLayerPhotos);
	map.addLayer(photoMarkers);
});

// --- Second dataset: Swarm check-ins ---
var geojsonLayerCheckins = new L.geoJson.ajax("https://raw.githubusercontent.com/jaredczn/europe-map/master/swarm_checkins.geojson", {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: createSvgIcon(PATH_LOCATION_ON, "#ef9a9a", "#ffffff") // light red circle
		});
	},
	onEachFeature: function (feature, layer) {
		layer.bindPopup(
			feature.properties.venue.name
		);

		// Popup hover effect
		layer.on("popupopen", function () {
			const iconEl = layer.getElement();
			if (iconEl) iconEl.classList.add("popup-open");
		});
		layer.on("popupclose", function () {
			const iconEl = layer.getElement();
			if (iconEl) iconEl.classList.remove("popup-open");
		});
	}
});

geojsonLayerCheckins.on('data:loaded', function () {
	checkinMarkers.addLayer(geojsonLayerCheckins);
	// map.addLayer(checkinMarkers); // hide check-ins by default
});

// --- Layer control ---
var overlayMaps = {
	"Photos": photoMarkers,
	"Check-ins": checkinMarkers
};
L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);