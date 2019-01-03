'use strict';
var request = require('request');




const geoCoding = async function(address){
let x ={
    "results" : [
       {
          "address_components" : [
             {
                "long_name" : "Forum Mall",
                "short_name" : "Forum Mall",
                "types" : [
                   "bus_station",
                   "establishment",
                   "point_of_interest",
                   "transit_station"
                ]
             },
             {
                "long_name" : "Hosur Road",
                "short_name" : "Hosur Rd",
                "types" : [ "route" ]
             },
             {
                "long_name" : "7th Block",
                "short_name" : "7th Block",
                "types" : [ "political", "sublocality", "sublocality_level_2" ]
             },
             {
                "long_name" : "Koramangala",
                "short_name" : "Koramangala",
                "types" : [ "political", "sublocality", "sublocality_level_1" ]
             },
             {
                "long_name" : "Bengaluru",
                "short_name" : "Bengaluru",
                "types" : [ "locality", "political" ]
             },
             {
                "long_name" : "Bangalore Urban",
                "short_name" : "Bangalore Urban",
                "types" : [ "administrative_area_level_2", "political" ]
             },
             {
                "long_name" : "Karnataka",
                "short_name" : "KA",
                "types" : [ "administrative_area_level_1", "political" ]
             },
             {
                "long_name" : "India",
                "short_name" : "IN",
                "types" : [ "country", "political" ]
             },
             {
                "long_name" : "560030",
                "short_name" : "560030",
                "types" : [ "postal_code" ]
             }
          ],
          "formatted_address" : "Forum Mall, Hosur Rd, 7th Block, Koramangala, Bengaluru, Karnataka 560030, India",
          "geometry" : {
             "location" : {
                "lat" : 12.934775,
                "lng" : 77.61231909999999
             },
             "location_type" : "GEOMETRIC_CENTER",
             "viewport" : {
                "northeast" : {
                   "lat" : 12.9361239802915,
                   "lng" : 77.61366808029149
                },
                "southwest" : {
                   "lat" : 12.9334260197085,
                   "lng" : 77.61097011970848
                }
             }
          },
          "partial_match" : true,
          "place_id" : "ChIJMW_18k0UrjsR8pEDxqXIjdY",
          "plus_code" : {
             "compound_code" : "WJM6+WW Bengaluru, Karnataka, India",
             "global_code" : "7J4VWJM6+WW"
          },
          "types" : [
             "bus_station",
             "establishment",
             "point_of_interest",
             "transit_station"
          ]
       },
       {
          "address_components" : [
             {
                "long_name" : "Bengaluru",
                "short_name" : "Bengaluru",
                "types" : [ "locality", "political" ]
             },
             {
                "long_name" : "Karnataka",
                "short_name" : "KA",
                "types" : [ "administrative_area_level_1", "political" ]
             },
             {
                "long_name" : "India",
                "short_name" : "IN",
                "types" : [ "country", "political" ]
             },
             {
                "long_name" : "560095",
                "short_name" : "560095",
                "types" : [ "postal_code" ]
             }
          ],
          "formatted_address" : "Forum mall, 208, 2nd floor, Hosur main road Koramangala, Bengaluru, Karnataka 560095, India",
          "geometry" : {
             "location" : {
                "lat" : 12.9345296,
                "lng" : 77.61112600000001
             },
             "location_type" : "GEOMETRIC_CENTER",
             "viewport" : {
                "northeast" : {
                   "lat" : 12.9358785802915,
                   "lng" : 77.61247498029152
                },
                "southwest" : {
                   "lat" : 12.9331806197085,
                   "lng" : 77.60977701970852
                }
             }
          },
          "partial_match" : true,
          "place_id" : "ChIJn5Z8MlEUrjsRCavTEE_tVcM",
          "plus_code" : {
             "compound_code" : "WJM6+RF Bengaluru, Karnataka, India",
             "global_code" : "7J4VWJM6+RF"
          },
          "types" : [ "establishment", "point_of_interest", "shopping_mall" ]
       }
    ],
    "status" : "OK"
 }


 await request('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCVh6dK0LbT9JKXl-NwvjDKJHKegH7AzhI&address='+address, function (error, response, body) {
   
 body =JSON.parse(body)
 if(response.statusCode === 200 && body['status']!== 'OVER_QUERY_LIMIT')  {
 console.log('error:', error); // Print the error if one occurred and handle it
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
           console.log(body)
          console.log(body['results'][0]['geometry']['bounds']['northeast']['lat'])
            console.log(body['results'][0]['geometry']['bounds']['northeast']['lng'])

            var obj = {
                'lat':x['results'][0]['geometry']['bounds']['northeast']['lat'],
                'lng':x['results'][0]['geometry']['bounds']['northeast']['lng']
            }
            // return obj
        }else{
            var obj = {
                'lat':x['results'][0]['geometry']['location']['lat'],
                'lng':x['results'][0]['geometry']['location']['lat']
            }
            console.log(obj)
            return obj;
        
        }
    });

}


module.exports = {
    geoCoding
}