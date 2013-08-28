/**
	This is not a general API.  It is specifically for the application
	It's purpose is to easily get us to a stop list and departure 
  information.

	Direction is tricky.  I think that people just want to get home
  so I just make a "new" route that has a name that appends the 
  direction.

  The functions attached to the objects will not survive 
  mongo db.  But I like them.  Also, the entire list of all
  stops routes etc loaded into a node process is on the order of 25 MB
  and I'm not worried about that kind of efficiency right now
*/

var base_url = "http://services.my511.org/Transit2.0/"

//Easy way to inject a transport function so everything can be tested
WrapAPI = function (token, transport) {

  return {GetAgencies   : GetAgencies
      	,	GetRoutes 		: GetRoutes
      	, GetStops 		  : GetStops
      	, GetDepartures : GetDepartures}

	// Documentation at http://511.org/docs/RTT%20API%20V2.0%20Reference.pdf
	// Interface, implementation below

  /*
      Raison d'etra.  The main engine of all this.
      From a flow perspective this should be last,
      since everything builds up to it.  But from
      an importance perspective it is first.  Also
      in working with all this I found myself coming to this
      function most of the time.

      Even though you call this with one stop, you will
      be returned an array of departures.  The Stop Code is
      NOT unique across routes. Millbrae, Daly City, SF Airport
      are all different routes, but they share many of the same 
      stops.
        {name           : "Embarcadero"
        , code          : "43"
        , route         : Route           // see buildRoute
        , value         : "Embarcadero"   // for Typeahead.js same as .name
        // Money shot for this call if the Route is not running
        // then departures == false
        , departures    : [{time: 9}, {time: 15}]
        , GetDepartures : function (cb)}
   */
  function GetDepartures(stop, cb) {
    transport(base_url + 'GetNextDeparturesByStopCode.aspx' 
      , {token:token
        , stopcode: stop.code}
      , function processDepartures(err, _data) {
          // console.log(util.inspect(_data, true, 15))

          var ret =[]
          var _agency = 
          _data
            .AgencyList[0]
            .Agency
            .forEach(function(_agency){
              var agency = buildAgency(_agency)
              _agency 
                .RouteList[0]
                .Route
                .forEach(function(_route){
                  // console.log(util.inspect(_route, true, 15))
                  //TODO need to handle direction
                  var route =  buildRoute(agency, _route, false)
                  _route
                    .StopList[0]
                    .Stop
                    .forEach(function(_stop){
                      // console.log(util.inspect(_stop, true, 15))
                      var stop = buildStop(route, _stop)
                      // In testing I have seen various ways for the API to say
                      // no departures here.  Either
                      //    DepartureTimeList == [] 
                      //    DepartureTimeList == ['']
                      if (_stop.DepartureTimeList.length
                        && _stop.DepartureTimeList[0].DepartureTime) {
                        stop.departures = _stop
                                            .DepartureTimeList[0]
                                            .DepartureTime
                                            .map(function(t){
                                              return{time:t}})
                      } else {
                        stop.departures = false
                      }

                      ret.push(stop)
                    })
                  })
            })
          cb(err, ret) 
      })
  }

  /*
    Helper function for GetStops and GetDepartures.
  */
  function buildStop(route, _stop) {
    var stop = {
        name          : _stop.name
      , code          : _stop.StopCode
      , route         : route
      , value         : _stop.name
      , GetDepartures : function GetDeparturesLocal(cb){ 
          GetDepartures(stop, cb)}}

    return stop
   }

	/**
    Get all Agencies.  Returns an array of agencies
      from buildAgency 
        {name           : "BART"
        , hasDirection  : false
        , mode          : "Rail"
        , GetRoutes     : function(cb)}
  */
	function GetAgencies(cb) {
		transport(base_url + 'GetAgencies.aspx' 
			, {token:token}
			, function GetAgenciesCB(err, data) {
					// Error handle
					var ret = data
                      .AgencyList[0]
                      .Agency
                      .map(buildAgency)

						cb(err, ret)
					})
	}

  /**
    Helper function to build an Agency object
  */
  function buildAgency(_agency){
    var agency = {name        : _agency.Name
                , hasDirection: _agency.HasDirection == 'True'
                , mode        : _agency.Mode
                , GetRoutes   : function GetRoutesLocal(cb) {
                    GetRoutes(agency, cb)}}
    return agency
  } 

  /**
    Get all Routes for an Agency.  Returns an array of routes
      from buildRoute
        {name         : "Pittsburg/Bay Point"
        , code        : ""
        , direction   : false
        , agency      : Agency // see buildAgency
        , GetStops    : function (cb)}
  */
	function GetRoutes(agency, cb) {
		// GetRoutesForAgency.aspx
		transport(base_url + 'GetRoutesForAgency.aspx'
			, {token       : token
				,	agencyName : agency.name}
			, function GetRoutesCB(err, data) {
				var ret = []

				data
					.AgencyList[0]
					.Agency[0]
					.RouteList[0]
					.Route
					.forEach(function processRoutes(_route) {
            // See RouteObject for why this is ugly
						if (agency.hasDirection) {
							if (util.isArray(_route.RouteDirectionList.RouteDirection)) {
                ret = _route
                        .RouteDirectionList[0]
                        .RouteDirection
                        .forEach(_.partial(buildRoute, agency, _route))
							}
						} else {
              ret.push(buildRoute(agency, _route))
						}
          })
				cb(err, ret)
			})
	}

  /**
    Helper function to build a Route object.  
      Note: Directions are a pain.  It would be nice to be
      able to get the RouteDirectionList check into this function.
      Maybe I should pull that code out of the GetRoutes...
  */
  function buildRoute(agency, _route, _dir) {
    var route =  {name      : _route.Name + '' + (_dir ? ' ' + _dir.Code : '')
                , code      : _route.Code
                , direction : _dir ? _dir.Code : false
                , agency    : agency
                , GetStops  : function(cb) {GetStops(route, cb)}}
    return route
  }

  /**
    Get all Stops for a Route.  Returns an array of stops
      from buildStop
        {name           : "Embarcadero"
        , code          : "43"
        , route         : Route           // see buildRoute
        , value         : "Embarcadero"   // for Typeahead.js same as .name
        , GetDepartures : function (cb)}
  */
	function GetStops(route, cb) {
		transport(base_url + 'GetStopsForRoute.aspx' 
			, {token     :token
        // Format: SamTrans~86~EAST
				, routeIDF : route.agency.name 
                      + '~' + route.code
                      // Done is better than good.
                      + (route.direction        ? 
                          '~' + route.direction :
                          '')}
			, function processStops(err, data) {

    			var ret = []
          var _route = data
                        .AgencyList[0]
                        .Agency[0]
                        .RouteList[0]
                        .Route[0] // Call should return a single Route

          if (route.direction) {
            //TODO There is a problem here.  Multiple directions.
            var stops = _route
                          .RouteDirectionList[0]
                          .RouteDirection[0]
                          .StopList[0]
                          .Stop
          } else {
            var stops = _route
                          .StopList[0]
                          .Stop
          }

          if (util.isArray(stops)){
            ret = stops.map(_.partial(buildStop, route))
          }
          
          cb(err, ret)
		})
	}
}