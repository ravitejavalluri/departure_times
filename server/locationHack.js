// This is all because the $geoNear function 
// does not appear to be working in Meteor.
// I added the index Stops._ensureIndex({ loc : "2dsphere" })
// but it still does not work.  My GeoJSON
// is correct, so I'm guessing there is something
// simple I'm missing.  But as with many problems,
// who steps up to help you?  Math!

// The $where clause in mongo will result
// in a table scan.  So I can use a 
// a degree of latitude or longitude can be
// approximated as a distance.
// This way I can do a range check on
// a simple index.
// Then use a filter function.
// These distances (meters) can be used
// to calculate min/max values for a database
// query that we can refine with actual 
// calculation.
// latitude: {38.5  : 111005.93326518971
//            37    : 110977.61794818664}
// longitude: {38.5 : 87232.73494671563
//             37   : 89011.64015152554}

// Expose the function
geoNearHack = function nearHack(radius, coordinates) {
  var lonRange = radiusInDegLongitude(radius)
  var latRange = radiusInDegLaitude(radius) 

  return Stops
          .find({"loc.coordinates.0"   : {$gt: coordinates.longitude - lonRange
                                          , $lt: coordinates.longitude + lonRange}
                , "loc.coordinates.1"  : {$gt: coordinates.latitude - latRange
                                          , $lt: coordinates.latitude + latRange}})
          .fetch()
          .filter(_.partial(stop_is_near, radius, coordinates))
          .reduce(function(ret, stop){
            return ret.concat(stop.code)
          }, [])
}

// performs the the distance calculation on a sphere
// and true/false if the stop is within the
// radius of the location.
//
// radius in Meters
// location is expected to be a Position object
//    from navigator.geolocation.getCurrentPosition
function stop_is_near(radius, coordinates, stop_location){
  if (stop_location.loc) {
    return radius > great_circle(coordinates, stop_location)
  } else {
    return false
  }
}

// See: http://www.movable-type.co.uk/scripts/latlong.html
// if you want the details
function great_circle(coordinates, stop) {
  var lon1 = degToRadians(coordinates.longitude)
  var lat1 = degToRadians(coordinates.latitude)

  var lon2 = degToRadians(stop.loc.coordinates[0])
  var lat2 = degToRadians(stop.loc.coordinates[1])

  return Math.acos(Math.sin(lat1)*Math.sin(lat2)
                    + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))
                  *6371*1000 // Radius of the earth in meters
}

// does what is says.
function degToRadians(deg) {
  if (deg) {
    return deg*Math.PI/180;
  } else {
    return NaN
  }
}

// See: http://www.csgnetwork.com/degreelenllavcalc.html
// to calculate the constants.  Also, used
// the largest values so I know that the
// circle will be contained withing the square.
// Finally, this approximation will only work
// for a given small area of the earth.
// Need to balance the cost of calculating
// these constants against how many records
// we are searching in the db.
function radiusInDegLongitude(radius) {
  return radius/111005.93326518971
}

function radiusInDegLaitude(radius) {
  return radius/110977.61794818664
}
