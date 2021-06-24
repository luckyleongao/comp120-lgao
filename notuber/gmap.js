let map;

function initMap() {
    // Define a global info window
    var infowindow = new google.maps.InfoWindow();

    // Create a map
    map = new google.maps.Map(document.getElementById("gmap"), {
        zoom: 1
    });

    // Create center marker
    var center_marker = new google.maps.Marker({
        title: "my position",
        map: map
    });

    // Get HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }

    // Create marker for my position
    function showPosition(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        map.setCenter(pos);
        center_marker.setPosition(pos);
        getVehicleInfoList(pos);
        displayNearbyPlaces(pos);
    }

    // Handle geolocation errors
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              alert("An unknown error occurred.");
              break;
          }
    }
    
    // Request vehicle infos from server
    function getVehicleInfoList(pos) {
        var xhttp = new XMLHttpRequest();
        var url = "https://jordan-marsh.herokuapp.com/rides";
        var params = "username=pPHjoZLM&lat=" + pos.lat + "&lng=" + pos.lng;
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                calMinDistance(pos, JSON.parse(xhttp.responseText));
            }
        };
        xhttp.send(params);
    }

    // Calculate distances from my position to all the other vehicles
    function calMinDistance(myPos, jsonData) {
        const dist_arr = [];
        var my_pos = new google.maps.LatLng(myPos.lat, myPos.lng);
        for (let i = 0; i < jsonData.length; i++) {
            var car_pos = new google.maps.LatLng(jsonData[i].lat, jsonData[i].lng);
            var distance = google.maps.geometry.spherical.computeDistanceBetween(my_pos, car_pos);
            dist_arr[i] = distance; 
        };
        var min_dist = Math.min.apply(Math, dist_arr);
        var min_index = dist_arr.indexOf(min_dist);
        var min_dist_car = jsonData[min_index].username;

        addInfoWindowListener(min_dist, min_dist_car);
        addPolyline(myPos, jsonData[min_index].lat, jsonData[min_index].lng);
        createVehicleMarkers(jsonData, dist_arr);
    }

    // Add info window for my position
    function addInfoWindowListener(min_dist, min_dist_car) {
        center_marker.addListener("click", () => {
            infowindow.setContent("<p>" + "Closest car: " + min_dist_car + "<br />" + "Distance: " + min_dist * 0.000621371192 + "miles" + "</p>");
            infowindow.open(map, center_marker);
        });
    }

    // Render a polyline between my position and the closest car
    function addPolyline(myPos, min_dist_car_lat, min_dist_car_lng) {
        const coordsPath = [
            {lat: myPos.lat, lng: myPos.lng},
            {lat: min_dist_car_lat, lng: min_dist_car_lng},
        ];
        const min_polyline = new google.maps.Polygon({
            paths: coordsPath,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
        });
        min_polyline.setMap(map);
    }

    // Create marker for vehicles
    function createVehicleMarkers(jsonData, dist_arr) {
        for (let i = 0; i < jsonData.length; i++) {
            const car_pos = {lat: jsonData[i].lat, lng: jsonData[i].lng};
            const car_name = jsonData[i].username;
            const car_marker = new google.maps.Marker({
                position: car_pos,
                title: car_name,
                icon: "car.png",
                map: map
            });
            // Add info window for vehicles
            car_marker.addListener("click", () => {
                infowindow.setContent("<p>" + "Car: " + car_name + "<br />" + "Distance: " + dist_arr[i] * 0.000621371192 + "miles" + "</p>");
                infowindow.open(map, car_marker);
            });
        }
    }

    // Display nearby places
    function displayNearbyPlaces(pos) {
        const placeType = new Array("restaurants", "bar", "cafe");
        searchNearbyPlaces(pos, placeType);  
    }

    // Perform a nearby search
    function searchNearbyPlaces(pos, placeType) {
        // Create the places service
        const service = new google.maps.places.PlacesService(map);
        for (let i = 0; i < placeType.length; i++) {
            service.nearbySearch(
                {location: pos, radius: 1609.344, type: placeType[i]},
                (results, status) => {
                    if (status !== "OK" || !results) return;
                    addPlaces(results, map);
                }
            );
        }
    }

    // Add place markers to the map
    function addPlaces(places, map) {
        for (const place of places) {
            if (place.geometry && place.geometry.location) {
                const image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25),
                };
                const marker = new google.maps.Marker({
                    map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                });
                marker.addListener("click", () => {
                    infowindow.setContent(place.name);
                    infowindow.open(map, marker);
                });
            }
        } 
    }
    
}