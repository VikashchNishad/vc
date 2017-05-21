var mongoose = require('mongoose'); // requiring the Mongoose driver...
var devops_tutorial = mongoose.model('devops_tutorial'); // Referencing the model...




 // Controller for Get all devops_tutorials..
module.exports.devops_tutorialsGetAll = function(req, res) {
 
  console.log('Requested by: ' + req.user);
  console.log('GET the devops_tutorials');
  console.log(req.query);

  var offset = 0; //Starting position....
  var count = 5; // Number of devops_tutorials returns at once...
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

  // Insted of collection we use devops_tutorial model here.....
  devops_tutorial   
    .find()           // finding the collections
    .skip(offset)     // Number of document to skip...
    .limit(count)     // Number of document that we want to return...
    .exec(function(err, devops_tutorials) {
      console.log(err);
      console.log(devops_tutorials);      
      if(err){
        console.log("Error finding devops_tutorials");
        res
          .status(500)
          .json(err);
      } else{
        console.log("Found devops_tutorial", devops_tutorials.length);
        res
          .json(devops_tutorials);
        }
    });
};

  // Controller for Get one devops_tutorial..
module.exports.devops_tutorialsGetOne = function(req, res) {
	
  var devops_tutorialId = req.params.devops_tutorialId; // extracting the url parameter....
	console.log('GET devops_tutorialId', devops_tutorialId);
  
 // Insted of collection we use Hotel model here.....
  devops_tutorial
    .findById(devops_tutorialId)
    .exec(function(err, doc) {
      var response = {
          status : 200,
          message : doc
      };
       if(err){
          console.log("Error finding devops_tutorial");
          response.status = 500;
          response.message = err;
        } else if(!doc){
          response.status = 404;
          response.message = {
              "message" : "devops_tutorial ID not found"
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

// Controller for Adding new documents to devops_tutorial database...
  module.exports.devops_tutorialsAddOne = function(req, res) {
    console.log("POST new devops_tutorial");
      var name   = req.body.name ;
      var id   = req.body.id ;
    devops_tutorial
    .create({
        name : name,
        id: id    
      }, function(err, devops_tutorial) {
          if(err){
            console.log("Error creating devops_tutorial");
            res
              .status(400)
              .json(err);
        } else{
            console.log("devops_tutorial created ", devops_tutorial);
              res
                .status(201)
                .json(devops_tutorial)
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
    // Deleting the devops_tutorial document......
    module.exports.devops_tutorialsDeleteOne = function(req, res) {
      var devops_tutorialId = req.params.devops_tutorialId; // extracting the url parameter....

      devops_tutorial
        .findByIdAndRemove(devops_tutorialId)
        .exec(function(err, devops_tutorial) {
          if(err){
            res
              .status(400)
              .json(err);
          } else{
            console.log("devops_tutorial Deleted, id:", devops_tutorialId);
            res
              .status(200)
              .json();
            }
        });
    };