maptilersdk.config.apiKey = MAP_KEY;
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [73.0498,33.7077], // starting position [lng, lat]
      zoom: 19 // starting zoom
    });
