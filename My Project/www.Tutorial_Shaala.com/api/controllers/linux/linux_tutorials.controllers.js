var mongoose = require('mongoose'); // requiring the Mongoose driver...
var linux_tutorial = mongoose.model('linux_tutorial'); // Referencing the model...




 // Controller for Get all linux_tutorials..
module.exports.linux_tutorialsGetAll = function(req, res) {
 
  console.log('Requested by: ' + req.user);
  console.log('GET the linux_tutorials');
  console.log(req.query);

  var offset = 0; //Starting position....
  var count = 5; // Number of linux_tutorials returns at once...
  var maxCount = 10;


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

  // Insted of collection we use linux_tutorial model here.....
  linux_tutorial   
    .find()           // finding the collections
    .skip(offset)     // Number of document to skip...
    .limit(count)     // Number of document that we want to return...
    .exec(function(err, linux_tutorials) {
      console.log(err);
      console.log(linux_tutorials);      
      if(err){
        console.log("Error finding linux_tutorials");
        res
          .status(500)
          .json(err);
      } else{
        console.log("Found linux_tutorial", linux_tutorials.length);
        res
          .json(linux_tutorials);
        }
    });
};

  // Controller for Get one linux_tutorial..
module.exports.linux_tutorialsGetOne = function(req, res) {
	
  var linux_tutorialId = req.params.linux_tutorialId; // extracting the url parameter....
	console.log('GET linux_tutorialId', linux_tutorialId);
  
 // Insted of collection we use Hotel model here.....
  linux_tutorial
    .findById(linux_tutorialId)
    .exec(function(err, doc) {
      var response = {
          status : 200,
          message : doc
      };
       if(err){
          console.log("Error finding linux_tutorial");
          response.status = 500;
          response.message = err;
        } else if(!doc){
          response.status = 404;
          response.message = {
              "message" : "linux_tutorial ID not found"
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

// Controller for Adding new documents to linux_tutorial database...
  module.exports.linux_tutorialsAddOne = function(req, res) {
    console.log("POST new linux_tutorial");
     var name   = req.body.name ;
     var id   = req.body.id ;
    linux_tutorial
    .create({
        name : name,
        id: id    
      }, function(err, linux_tutorial) {
          if(err){
            console.log("Error creating linux_tutorial");
            res
              .status(400)
              .json(err);
        } else{
            console.log("linux_tutorial created ", linux_tutorial);
              res
                .status(201)
                .json(linux_tutorial)
          }
      });
    };



/*
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
 */
    // Deleting the linux_tutorial document......
    module.exports.linux_tutorialsDeleteOne = function(req, res) {
      var linux_tutorialId = req.params.linux_tutorialId; // extracting the url parameter....

      linux_tutorial
        .findByIdAndRemove(linux_tutorialId)
        .exec(function(err, linux_tutorial) {
          if(err){
            res
              .status(400)
              .json(err);
          } else{
            console.log("linux_tutorial Deleted, id:", linux_tutorialId);
            res
              .status(200)
              .json();
            }
        });
    };