var mongoose = require('mongoose'); // requiring the Mongoose driver...
var Hotel = mongoose.model('Hotel'); // Referencing the model...


var runGeoQuery = function(req, res) {
    // extracting the url parameter....
    var lng = parseFloat(req.query.lng); 
    var lat = parseFloat(req.query.lat);

    // A geoJSON point...This point is use by MongoDB to do the calculation of points on the sphere...
    var point = {
        type : "Point",
        coordinates : [lng, lat]  // Order is required....in lng and lat..
    };

    var geoOptions = {
      spherical : true,
      maxDistance : 2000,  // In meter....
      num : 5             // Number of record to come...
    };

    Hotel
      .geoNear(point, geoOptions, function(err, results, stats) {
              console.log('Geo results', results);
              console.log('Geo stats', stats);
              res
                .status(200)
                .json(results);
      });
};


 // Controller for Get all hotels..
module.exports.hotelsGetAll = function(req, res) {
 
  console.log('Requested by: ' + req.user);
  console.log('GET the hotels');
  console.log(req.query);

  var offset = 0; //Starting position....
  var count = 5; // Number of hotels returns at once...
  var maxCount = 10;

      // For coordinate API
      if(req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
      }

       if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10); //converting offset string into number...
       }

       if(req.query && req.query.count){
        count = parseInt(req.query.count, 10); //converting count string into number...
       }

       //Error trapping....
      if(isNaN(offset) || isNaN(count)){
         res
          .status(400)
          .json(
            {
               "message" : "If suplied in querystring count and offset should be numbers"
            });
               return;
        }
        if(count > maxCount){
          res
            .status(400)
            .json(
            {
              "message" : " Count limit of " + maxCount + " exceeded"
            });
            return;
        }

  // Insted of collection we use Hotel model here.....
  Hotel   
    .find()           // finding the collections
    .skip(offset)     // Number of document to skip...
    .limit(count)     // Number of document that we want to return...
    .exec(function(err, hotels) {
      console.log(err);
      console.log(hotels);      
      if(err){
        console.log("Error finding Hotels");
        res
          .status(500)
          .json(err);
      } else{
        console.log("Found Hotel", hotels.length);
        res
          .json(hotels);
        }
    });
};

  // Controller for Get one hotel..
module.exports.hotelsGetOne = function(req, res) {
	
  var hotelId = req.params.hotelId; // extracting the url parameter....
	console.log('GET hotelId', hotelId);
  
 // Insted of collection we use Hotel model here.....
  Hotel
    .findById(hotelId)
    .exec(function(err, doc) {
      var response = {
          status : 200,
          message : doc
      };
       if(err){
          console.log("Error finding Hotel");
          response.status = 500;
          response.message = err;
        } else if(!doc){
          response.status = 404;
          response.message = {
              "message" : "Hotel ID not found"
          };
        }
          res
            .status(response.status)
            .json(response.message);
      });
};

  var _splitArray = function(input) {
      var output;
        if(input && input.length > 0) {
          output = input.split(";");
        } else {
          output = [];
        }
        return output;
    };

// Controller for Adding new documents to hotel database...
  module.exports.hotelsAddOne = function(req, res) {
    console.log("POST new hotel");
    Hotel
    .create({
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars,10),
        services : _splitArray(req.body.services),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
        location : {
          address : req.body.address,
          coordinates : [
                parseFloat(req.body.lng), 
                parseFloat(req.body.lat)]
        }    
      }, function(err, hotel) {
          if(err){
            console.log("Error creating hotel");
            res
              .status(400)
              .json(err);
        } else{
            console.log("Hotel created ", hotel);
              res
                .status(201)
                .json(hotel)
          }
      });
    };

  // Updating hotel documents........
  module.exports.hotelsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId; // extracting the url parameter....
    console.log('GET hotelId', hotelId);

    Hotel
      .findById(hotelId)
      .select("-reviews -rooms")   // excluding the reviews and rooms path....
      .exec(function(err, doc) {
        var response = {
            status : 200,
            message : doc
        };
         if(err){
            console.log("Error finding Hotel");
            response.status = 500;
            response.message = err;
          } else if(!doc){
            response.status = 404;
            response.message = {
                "message" : "Hotel ID not found"
            };
          }
          if(response.status !== 200){
            res
              .status(response.status)
              .json(response.message);
          } else {
              doc.name = req.body.name;
              doc.description = req.body.description;
              doc.stars = parseInt(req.body.stars,10);
              doc.services = _splitArray(req.body.services);
              doc.photos = _splitArray(req.body.photos);
              doc.currency = req.body.currency;
              doc.location = {
                  address : req.body.address,
                  coordinates : [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                        ]
                    };  

              doc.save(function(err, hotelUpdated){
                  if(err){
                      res
                        .status(500)
                        .json(err);
                  } else{
                      res
                        .status(204)
                        .json();
                    }
            });  
          }
       });
    };
 
    // Deleting the hotel document......
    module.exports.hotelsDeleteOne = function(req, res) {
      var hotelId = req.params.hotelId; // extracting the url parameter....

      Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, hotel) {
          if(err){
            res
              .status(400)
              .json(err);
          } else{
            console.log("Hotel Deleted, id:", hotelId);
            res
              .status(200)
              .json();
            }
        });
    };