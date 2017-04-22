// curl 'https://c.data.osmbuildings.org/0.2/ph2apjye/tile/15/23447/15191.json' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36' -H 'Referer: https://osmbuildings.org/?lat=12.98&lon=77.59956&zoom=18&rotation=0&tilt=30' -H 'Origin: https://osmbuildings.org' --compressed
// curl 'https://d.data.osmbuildings.org/0.2/ph2apjye/tile/15/23443/15196.json' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36' -H 'Referer: https://osmbuildings.org/?lat=12.92927&lon=77.58242&zoom=10&rotation=0&tilt=30' -H 'Origin: https://osmbuildings.org' --compressed

var request = require('request')
var _ = require('lodash')
var fs = require('fs');
var turf = require('turf-area');
var inside = require('point-in-polygon');
var geolib = require('geolib');
var jaya = fs.readFileSync("jaya.txt");
var bounds = jaya.toString().split(" ").map( function(i){
  var pt = i.split(",");
  return [ parseFloat(pt[0]) , parseFloat(pt[1]) ];
});

var localities = {
  "jayanagar" : bounds
}

// to check if a given point is inside a bounding region
function is_inside(point, bounds){
  // ret = inside( check, localities["jayanagar"] );
  var poly = bounds.map( function(i){
    return { latitude: i[0] , longitude : i[1] };
  });

  console.log( poly );
  console.log( point );

  ret = geolib.isPointInside(
      {latitude: point[0], longitude: point[1]},
      poly
      );
  console.log( ret );
  return ret
}

// // check if inside jayanagar
// var check = [
//   77.5828636, 12.9299597
// ];
// 
// is_inside( check , localities["jayanagar"] );
// process.exit();

var output = {}

function transform(item){
  var obj = {}
  var polygons = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": item.geometry
      }
    ]
  };

  // console.log( polygons );
  var area = turf(polygons);
  // console.log( "area " + area );

  obj[ item.id ] = {
    "coords" : item.geometry.coordinates[0],
    "area" : area,
  };

  console.log( item.geometry.coordinates[0][1] );
  return obj;
  // if( is_inside( item.geometry.coordinates[0][1] , localities["jayanagar"] ) ){
  //   console.log("inside");
  //   return obj;
  // }
  // else{
  //   console.log("outside");
  //   return null; 
  // }
}


var tile = "15197"
request({
  url : 'https://d.data.osmbuildings.org/0.2/ph2apjye/tile/15/23443/' + tile + '.json',
  headers : {
    "Referer" : "https://osmbuildings.org",
    "Origin" : "https://osmbuildings.org",
    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.    133 Safari/537.36"
  }
}, function( err, res, body ){
  if( err ){
    return console.error( err );
  }

  var data = JSON.parse( body );

  var result = _.map( data.features, transform );

  result = result.filter(Boolean)
  console.log( result.length );

  fs.writeFile("/tmp/tile_" + tile, JSON.stringify( result ) , function(){});
  //return console.log( body );
})
