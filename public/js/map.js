mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style:"mapbox://styles/mapbox/satellite-streets-v12",
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 13, // starting zoom
});

console.log(coordinates);

const marker2 = new mapboxgl.Marker({ color: "#179019"/*, rotation: 180*/ })
  .setLngLat(coordinates)
  .addTo(map);
