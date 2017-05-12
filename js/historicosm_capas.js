         var selectedLayer;
      // create layer selector
      function createSelector(layers) {
        var sql = new cartodb.SQL({ user: 'sigdeletras' });
 
        var $options = $('#layer_selector li');
        $options.click(function(e) {
          // get the area of the selected layer
          var $li = $(e.target);
          var layer = $li.attr('historic');
          if(selectedLayer != layer ){
            // definitely more elegant ways to do this, but went for
            // ease of understanding
            if (layer == 'monument'){
              layers.getSubLayer(0).show(); // countries
              layers.getSubLayer(1).show(); // cables
              layers.getSubLayer(2).show(); // populated places
            }
            else if (layer == 'ruins') {
              layers.getSubLayer(0).show();
              layers.getSubLayer(1).hide();
              layers.getSubLayer(2).show();
            }
            else {
              layers.getSubLayer(0).show();
              layers.getSubLayer(1).show();
              layers.getSubLayer(2).hide();
            }
          }
        });
      }
 
      var layerN = {};
      function main() {
        var map = L.map('map', { 
          
          //center: [40, -10],
            search: true,
            tiles_loader: true,
            center_lat: 40.416667, 
            center_lon: -3.75,
            zoom: 5
        });
        // get the currently selected style
        selectedStyle = $('li.selected').attr('historic');
 
        cartodb.createLayer(map, 'http://sigdeletras.cartodb.com/api/v2/viz/ee775ae8-c4de-11e3-afe5-0e73339ffa50/viz.json')
        .addTo(map)
        .done(function(layers) {
          createSelector(layers);
        })
        .error(function(err) {
          console.log(err);
        });
      }
 
      window.onload = main;