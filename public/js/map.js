maptilersdk.config.apiKey = MAP_KEY;
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: (Coordinates.split(",")), // starting position [lng, lat]
      zoom: 12 // starting zoom
    });

    const marker = new maptilersdk.Marker({
      color: "#ff0000",
    })
  .setLngLat(Coordinates.split(","))
  .setPopup(new maptilersdk.Popup().setHTML(`<h5>${Location+" ,"+Country}</h5><p>Exact location will be provided after booking!</p>`))
  .addTo(map);

  