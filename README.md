
#Live site

http://gtf.meteor.com


# Thoughts

## mobile vs browser

I'm not sure how Meteor would perform in a mobile environment.
So this has the typeahead working client side.

## only BART

I was only able to get location data for BART.  I think
it is clear from the code that I could extend this easily to
include other locations.  The http://transit.511.org/datafeed/feed_desc.html
feed should do the trick.  Notes in the code.

## getting departure times for many clients

Clearly the departure times are good for at least 1 min,
and many clients can connect at once.  So I added a time value
to the Departure object so that if 5 clients ping the server
for departure times, all of them don't need to send out a request.
My solution is not perfect because I don't lock the record
to specify that someone is making a request.  But I'm expecting
that this is a reasonable trade off.  Multiple requests could
only fire within the latency of an API request.

## mongo db geoNear

see /server/locationHack.js  My experience with mongo is limited.
But I think I understand enough to create a GeoJSON property and
index it with "2dsphere" but it does not seem to be working.
Once I get all that worked out it is a very simple change
to stop using the hack and do it the right way.

## location of stops visible on the client?

I was unsure about this, so I removed it.  I figure
the amount of trouble I went through to find the locations
indicates either people don't want this information published
or nobody has bothered to publish it.  No sure of the legality
so I walked on the safe side.

## tests

A project without tests is like an Emperor without clothes.
Which is to say new and embarrassing.  I tried to time bound this
for Sunday, but I have run a little over.  First time using Meteor
to do anything ate up some time.  I have 1 test running as an 
example and plan on putting in more.  The tests are using laika.
http://arunoda.github.io/laika/getting-started.html has the details
on getting an environment up.

## error handling and type checking

There is not enough error handling or type checking for 
production.  Usual I start adding that stuff in as I write
tests, because you need to write tests that fail.  Having the
code explode can work for development but it is not as supportable

## logging

any production app needs logging.  this one is small, but the major
points should have some kind of logging so that we can recreate any
bugs found.   

## setting the project up again from scratch

just so I remember such things
meteor add util
mrt add typeahead-js
mrt add xml2js
meteor remove autopublish