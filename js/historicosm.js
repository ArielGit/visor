      function main() {
        cartodb.createVis('map', 'http://sigdeletras.cartodb.com/api/v2/viz/5c93b55e-ced9-11e3-99e6-0e10bcd91c2b/viz.json', {
            shareable: true,
            //title: true,
            //description: true,
            search: true,
            tiles_loader: true,
            center_lat: 40.416667, 
            center_lon: -3.75,
            zoom: 5
        })
        .done(function(vis, layers) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          layers[1].on('featureOver', function(e, pos, latlng, data) {
            cartodb.log.log(e, pos, latlng, data);
          });

          // you can get the native map to work with it
          // depending if you use google maps or leaflet
          map = vis.getNativeMap();

          // now, perform any operations you need
          // map.setZoom(3)
          // map.setCenter(new google.maps.Latlng(...))
        })
        .error(function(err) {
          console.log(err);
        });
      }
      
      $('#madrid').click(function(){
      var position = new L.LatLng(40.716086427192394, -73.99330615997314);
      var zoom = 15;
      map.setView(position, zoom)
      })

      $('#cordoba').click(function(){
      var position = new L.LatLng(37.883333, -4.766667);
      var zoom = 14;
      map.setView(position, zoom)
      })

      $('#peninsula').click(function(){
      var position = new L.LatLng(40.416667, -3.75);
       var zoom = 6;
      map.setView(position, zoom)
      })
      $('#canarias').click(function(){
      var position = new L.LatLng(28.681,-15.743);
      var zoom = 8;
      map.setView(position, zoom)
      })


      window.onload = main;
    
