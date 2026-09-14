/**
 * Browser Geolocation Service & Distance Utilities
 */

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser. Please search by area manually."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission is required to find Ganesh idols near you. You can also search by area manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable on your device.";
        } else if (error.code === error.TIMEOUT) {
          msg = "The request to get your location timed out.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

export const formatDistance = (meters) => {
  if (meters === null || meters === undefined) return "";
  if (meters < 1000) {
    return `${Math.round(meters)} m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
};

export const getGoogleMapsDirectionsUrl = (lat, lng, name = "") => {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
};
