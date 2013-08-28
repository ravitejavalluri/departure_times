// Main dataset.  This will contain
// documents for every stop.
// Meteor keeps track of loading and updating
// departure times based on my two subscriptions
Deps.autorun(function() {
  Session.set('stops_loaded', false)
  Meteor.subscribe('stops', function stopsReady() {
    Session.set('stops_loaded', true)
  })
})

// Most of the magic. Session.get('watched_stops')
// should contain an array of stop codes e.g. ['43, '55']
// Every time someone sets the watched_stops Session var
// this function will execute.  Meteor magic.
function getDepartureTimes() {
  Session.set('departures_loaded', false)
    Meteor.subscribe('departure_times'
                  , Session.get('watched_stops')
                  , function departuresReady() {
                      Session.set('departures_loaded', true)
                    })
}
// Execute the departure times in a reactive context
// so all the Meteor magic happens
Deps.autorun(getDepartureTimes)
// Update the departure times from time to time (1 min)
Meteor.setInterval(getDepartureTimes,60*1000)

// Way to make sure we only render the 
// typeahead template once the data is ready.
Template.user_input.helpers({
  loaded: function() {
    return Session.get('stops_loaded')
  }
})

// Once we have data and the template is in 
// the DOM, stuff the data and bind the events
Template.typeahead.rendered = function() {
  $('.typeahead')
    .typeahead({name  : "stops"
              , local : Stops.find().fetch()})
    .bind('typeahead:selected', function(e, stop) {
      // Initial testing shows that
      // the typeahead object will not 
      // become reactive every time departure
      // information is added to the Stops collection

      // Set the watched_stops.  This should kick off
      // a new subscribe requests to departure_times
      // because there is a Session.get('watched_stops').
      // Meteor magic.
      Session.set('watched_stops', stop.code)
    })
    .bind('typeahead:closed', function(evt){
      // if you clear the typeahead, go back to departures
      // by location
      if(!$(evt.target).val()) {
        watch_locations_near()
      }
    })
}

// Function to pass the location data to the server.
// I could wrap this to follow you around, but 
// I'm not going to at this time.  That would
// be more of a mobile app, and I don't know how
// Meteor would perform in that world.  Since it loads
// the entire Stops collection.
function watch_locations_near() {
  navigator
    .geolocation
    .getCurrentPosition(function(pos){
      // I'm not exposing the locations for all the stops
      // to the clients for 2 reasons.
      // 1. It seems hard enough to get the locations that
      //    perhaps people don't want them exposed.
      // 2. minimongo does not implement $geoNear.
      Meteor.call('near', pos, function(err, stop_ids){
        // Set the watched_stops.  This should kick off
        // a new subscribe requests to departure_times
        // because there is a Session.get('watched_stops').
        // Meteor magic.
        Session.set('watched_stops', stop_ids)
      })
    })
}
watch_locations_near()  // execute it to make sure we have data

// Render all the departure times
Template.departures.helpers({
  watched_stops: function() {
    // Every time a new subscribe request is fired
    // This template will be re-rendered because
    // of the Session.get('watched_stops')
    // Meteor magic.
    console.log(Session.get('watched_stops'))
    if (Session.get('departures_loaded')){
      return Departures.find({code: {$in: Session.get('watched_stops')}})
    }
  }
})

// simple helper because my Handlebars experience
// is terribly infantile.
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});