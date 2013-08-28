transport = function (url, params, cb) {
	// TODO need to get some logging in here
	HTTP.get(url, {params: params}, function handleResponse(e, resp) {
    // Cleary some error handling is needed here!
    xml2js.parseString(resp.content
                    , {mergeAttrs       : true
                      , explicitArray   : true
                      , explicitRoot    : false}
                    , function(err, data) {
                    		// console.log(util.inspect(data, true, 15))
                        cb(err, data)
                    })
	})
}