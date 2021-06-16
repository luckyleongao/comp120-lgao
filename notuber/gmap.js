let map;

function initMap() {
    // Create a map
    var map = new google.maps.Map(document.getElementById("gmap"), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 14
    });

    // Create center marker
    var center_marker = new google.maps.Marker({
        position: {lat: 42.352271, lng: -71.05524200000001},
        title: "South Station, Boston, MA",
        map: map
    });

    // Define a global info window
    var infowindow = new google.maps.InfoWindow();

    // Open info window on click of marker
    center_marker.addListener("click", () => {
        infowindow.setContent(center_marker.title);
        infowindow.open(map, center_marker);
    });

    // Define positions and IDs for car markers
    const features = [
        { position: new google.maps.LatLng(42.3453, -71.0464), id: "mXfkjrFw" },
        { position: new google.maps.LatLng(42.3662, -71.0621), id: "nZXB8ZHz" },
        { position: new google.maps.LatLng(42.3603, -71.0547), id: "Tkwu74WC" },
        { position: new google.maps.LatLng(42.3472, -71.0802), id: "5KWpnAJN" },
        { position: new google.maps.LatLng(42.3663, -71.0544), id: "uf5ZrXYw" },
        { position: new google.maps.LatLng(42.3542, -71.0704), id: "VMerzMH8" },
    ];

    // Create car markers.
    for (let i = 0; i < features.length; i++) {
        const car_marker = new google.maps.Marker({
            position: features[i].position,
            title: features[i].id,
            icon: "car.png",
            map: map
        });
        // Open info window on click of marker
        car_marker.addListener("click", () => {
            infowindow.setContent(car_marker.title);
            infowindow.open(map, car_marker);
        });
    }

}