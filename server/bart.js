// Bart station locations

var _bart = [ 
  { name: 'Pittsburg/Bay Point'
  , latitude: 38.0154
  , longitude: -121.9424
  , waypoint: [3800.924,12156.546]}
, {	name: 'North Concord/Martinez'
  , latitude: 38.0035
  , longitude: -122.0247
  , waypoint: [3800.208,12201.480]}
, {	name: 'Concord'
  , latitude: 37.9741
  , longitude: -122.0282
  , waypoint: [3758.447,12201.693]}
, {	name: 'Pleasant Hill/Contra Costa Centre'
  , latitude: 37.9269
  , longitude: -122.0559
  , waypoint: [3755.612,12203.351]}
, {	name: 'Walnut Creek'
  , latitude: 37.9049
  , longitude: -122.0671
  , waypoint: [3754.295,12204.024]}
, {	name: 'Lafayette'
  , latitude: 37.8936
  , longitude: -122.1259
  , waypoint: [3753.615,12207.553]}
, {	name: 'Orinda'
  , latitude: 37.8785
  , longitude: -122.1833
  , waypoint: [3752.708,12210.996]}
, {	name: 'Rockridge (Oakland)'
  , latitude: 37.8446
  , longitude: -122.2516
  , waypoint: [3750.677,12215.097]}
, {	name: 'MacArthur (Oakland)'
  , latitude: 37.82
  , longitude: -122.2660
  , waypoint: [3749.762,12215.957]}
, {	name: '19th St. Oakland'
  , latitude: 37.8079
  , longitude: -122.2687
  , waypoint: [3748.472,12216.120]}
, {	name: '12th St. Oakland City Center'
  , latitude: 37.8033
  , longitude: -122.2719
  , waypoint: [3748.196,12216.314]}
, {	name: 'West Oakland'
  , latitude: 37.8053
  , longitude: -122.2951
  , waypoint: [3748.316,12217.707]}
, {	name: 'Embarcadero (SF)'
  , latitude: 37.7925
  , longitude: -122.3971
  , waypoint: [3747.552,12223.825]}
, {	name: 'Montgomery St. (SF)'
  , latitude: 37.7890
  , longitude: -122.4018
  , waypoint: [3747.338,12224.110]}
, {	name: 'Powell St. (SF)'
  , latitude: 37.7839
  , longitude: -122.4078
  , waypoint: [3747.036,12224.470]}
, {	name: 'Civic Center (SF)'
  , latitude: 37.7798
  , longitude: -122.4137
  , waypoint: [3746.789,12224.821]}
, {	name: '16th St. Mission (SF)'
  , latitude: 37.7648
  , longitude: -122.4198
  , waypoint: [3745.887,12225.185]}
, {	name: '24th St. Mission (SF)'
  , latitude: 37.7519
  , longitude: -122.4185
  , waypoint: [3745.112,12225.112]}
, {	name: 'Glen Park (SF)'
  , latitude: 37.7333
  , longitude: -122.4342
  , waypoint: [3743.996,12226.049]} 
, {	name: 'Balboa Park (SF)'
  , latitude: 37.7211
  , longitude: -122.4476
  , waypoint: [3743.268,12226.857]}
, {	name: 'Daly City'
  , latitude: 37.7051
  , longitude: -122.4693
  , waypoint: [3742.308,12228.159]}
, {	name: 'Colma'
  , latitude: 37.6835
  , longitude: -122.4635
  , waypoint: [3741.008,12227.808]}
, {	name: 'South San Francisco'
  , latitude: 37.6643
  , longitude: -122.4429
  , waypoint: [3739.856,12226.571]}
, {	name: 'San Bruno'
  , latitude: 37.6394
  , longitude: -122.4184
  , waypoint: [3738.361,12225.105]}
, {	name: 'San Francisco Int\'l Airport'
  , latitude: 37.6152
  , longitude: -122.3933
  , waypoint: [3736.909,12223.599]}
, {	name: 'Millbrae'
  , latitude: 37.6005
  , longitude: -122.3840
  , waypoint: [3736.032,12223.038]}
, {	name: 'Richmond'
  , latitude: 37.9369
  , longitude: -122.3515
  , waypoint: [3756.215,12221.088]}
, {	name: 'El Cerrito Del Norte'
  , latitude: 37.9257
  , longitude: -122.3175
  , waypoint: [3755.543,12219.050]}
, {	name: 'El Cerrito Plaza'
  , latitude: 37.9016
  , longitude: -122.3001
  , waypoint: [3754.094,12218.004]}
, {	name: 'North Berkeley'
  , latitude: 37.8737
  , longitude: -122.2825
  , waypoint: [3752.424,12216.951]}
, {	name: 'Downtown Berkeley'
  , latitude: 37.8700
  , longitude: -122.2680
  , waypoint: [3752.202,12216.078]}
, {	name: 'Ashby (Berkeley)'
  , latitude: 37.8511
  , longitude: -122.2707
  , waypoint: [3751.067,12216.243]}
, {	name: 'Lake Merritt (Oakland)'
  , latitude: 37.7970
  , longitude: -122.2652
  , waypoint: [3747.819,12215.911]}
, {	name: 'Fruitvale (Oakland)'
  , latitude: 37.7759
  , longitude: -122.2239
  , waypoint: [3746.553,12213.433]}
, {	name: 'Coliseum/Oakland Airport'
  , latitude: 37.7538
  , longitude: -122.1971
  , waypoint: [3745.230,12211.823]}
, {	name: 'San Leandro'
  , latitude: 37.7220
  , longitude: -122.1601
  , waypoint: [3743.321,12209.606]}
, {	name: 'Bayfair (San Leandro)'
  , latitude: 37.6975
  , longitude: -122.1296
  , waypoint: [3741.849,12207.777]}
, {	name: 'Hayward'
  , latitude: 37.6706
  , longitude: -122.0876
  , waypoint: [3740.238,12205.255]}
, {	name: 'South Hayward'
  , latitude: 37.6356
  , longitude: -122.0563
  , waypoint: [3738.135,12203.377]}
, {	name: 'Union City'
  , latitude: 37.5875
  , longitude: -122.0169
  , waypoint: [3735.252,12201.016]}
, {	name: 'Fremont'
  , latitude: 37.5565
  , longitude: -121.9773
  , waypoint: [3733.388,12158.639]}
, {	name: 'Castro Valley'
  , latitude: 37.6920
  , longitude: -122.0755
  , waypoint: [3741.519,12204.531]}
, {	name: 'Dublin/Pleasanton'
  , latitude: 37.7016
  , longitude: -121.8909
  , waypoint: [3742.094,12153.455]}
]

BART = new Meteor.Collection(null)
_bart.forEach(function(s) {
  BART.insert(s)
})