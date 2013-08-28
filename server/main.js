
// Publish all our stop information for typeahead
Meteor.publish('stops', function() {
  // Just hide the locations.  Seems like a good idea due to
  // the trouble I went through to get the locations...
  return Stops.find({}, {fields: {loc: 0}})
})

// Publish departure times for selected stops
Meteor.publish('departure_times', function(stops_to_watch) {
  // fire off a query to make sure the departure time are up-to-date
  // will need to find a way to keep making this query.  
  //  (setIneterval?, is the magic that good?)

  if (util.isArray(stops_to_watch)) {
    // need some kind of timeout.  There is no need to be
    // getting departure information every second for every
    // client that asks
    var timeout = (new Date()).getTime() - 55*1000
    var stops = Departures
                  .find({code           : {$in: stops_to_watch}
                        // The intinal condition is handled 
                        // when the doc is inserted so I never
                        // have to handle with .detartures_as_of == undefined
                      , detartures_as_of: {$lt: timeout}})
                  .fetch()

    // The my511.org API uses the same Stop Code for
    // Multiple stops on different routes.
    // A call to GetDepartures for a single Stop Code
    // will return times for all routes.
    // Since the remote call is slow and removing dups locally
    // is fast... 
    _.uniq(stops, false, function(i){return i.code})
      .forEach(function(stop) {
        API.GetDepartures(stop, function(err, stops_with_departures) {
          // As pointed out above, this will return multiple duplicate
          // stops for different routes e.g. Millbrae, Daly City, SF Airport
          stops_with_departures
            .forEach(function (departure_data){
              // Update the Departure collection with departure time
              // And add an as of time.  Then we can filter on that.
              // No need to be pulling the departure times over and
              // over again across different clients
              Departures.update({code        : departure_data.code
                              , "route.name": departure_data.route.name}
                            , {$set: {departures      : departure_data.departures
                                    , detartures_as_of: (new Date()).getTime()}})
            })
        })
      })

    // Publish departures
    return Departures.find({code      : {$in: stops_to_watch}
                          , departures: {$ne: false}}       // hide stops with no times
                        , {sort: {name:1, "route.name": 1}})
  }
})

// mongo db should expose a geospatial api.  However
// I am getting an error in Meteor.  Once this error
// is resolved, I should be able to replace the 
// current implementation with a more efficient one.

// Docs
// http://docs.mongodb.org/manual/core/geospatial-indexes/
// http://docs.mongodb.org/manual/reference/command/geoNear/

// To make the example work the index needs to be in place
// Stops._ensureIndex({ loc : "2dsphere" })
// asdf = Stops.find({loc: {$geoNear: [-122.4693, 37.7051] 
//                         // , $maxDistance: 100000000
//                       }}).fetch()
// console.log(asdf)

// See locationHack.js for current implementation
Meteor.methods({
  // Method to do the GPS calculations
  // should take a pos element from 
  // navigator.geolocation.getCurrentPosition
  near: function(position) {
    // return ['43', '91', '93']
    return geoNearHack(3000, position.coords) 
  }
})

API = WrapAPI('5fcef9ea-680b-49ff-a076-f2b7646ff397', transport)
// updateDB()  // no need to update the db every time we restart

// I need a way to populate the dataset
// For a production version I would use http://transit.511.org/datafeed/feed_desc.html
// This should have the GPS locations, stopCodes, route information
// But the terms of use would take too long if I want something today.
function updateDB() {
  API.GetAgencies(function(err, _agencies) {
    // Clearly choosing BART makes my life
    // easy.  Because I don't have to deal
    // with directions on the Routes.
    // I think that I have things abstracted
    // correctly, but I would test it twice
    // to be sure
    _agencies.forEach(function(_agencey) {
      if (_agencey.name == 'BART') {
        _agencey.GetRoutes(function(err, _routes){
          _routes.forEach(function(_route){
            _route.GetStops(function(err, _stops) {
              _stops.forEach(function(_stop){
                // Stop codes are NOT unique
                // routes: Millbrae, Daly City, SF Airport share stop codes
                Departures.update({code       : _stop.code
                                , "route.name": _stop.route.name}
                              , { $set: _stop
                                , $set: {detartures_as_of: 1}}
                              , {upsert: true})

                var loc = BART.findOne({name: _stop.name})
                var stop_code = _stop.code
                delete _stop.code // we want to have an array of codes
                if (loc) {
                  _stop.loc = {type       : "Point"
                            , coordinates : [ loc.longitude
                                            , loc.latitude]}
                } else { 
                  // console.log(_stop) // way to find stops w/o location info
                }

                // upsert the stop into the database
                // append the code
                Stops.update({name: _stop.name}
                          , {$set: _stop
                            , $addToSet: {code: stop_code}}
                          , {upsert: true})                
              })
            })
          })
        })
      }
    })
  })
}
