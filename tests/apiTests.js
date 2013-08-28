var assert = require('assert')

suite('API', function() {
  test('GetDepartures calls transport with a url string, querry params object, cb function'
    , function(done, server, client) {
        server.eval(function(){
          var API = WrapAPI('token', function testIsHere(url, params, cb) {
            emit('check', url, params)
          })
          API.GetDepartures({code:'myCode'}, function(){})
        })
        .once('check', function(url, params) {
          // right endpoint
          assert(url.search('GetNextDeparturesByStopCode.aspx') > -1)
          // right paramaters
          assert.equal(params.token, 'token')
          assert.equal(params.stopcode, 'myCode')
          done()
        })
  })

  /*
    It is not clear to me how to write incomplete tests.

    So I'll list them here.
    test('GetDepartures handles station without direction departure time')
    test('GetDepartures handles station with direction departure time')
    test('GetDepartures handles station DepartureTimeList = [] ')
    test('GetDepartures handles station DepartureTimeList = [''] ')
  */
  
})