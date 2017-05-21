
var mongoose = require('mongoose'); // requiring the Mongoose driver...
var devops_tutorial = mongoose.model('devops_tutorial'); // Referencing the model...

// GET all devops_comments for a devops_tutorial hotel
module.exports.devops_commentsGetAll = function(req, res) {
  var id = req.params.devops_tutorialId;  // extracting the url parameter....
  console.log('GET devops_comments for devops_tutorialId', id);
 
  devops_tutorial
    .findById(id)
    .select('devops_comments')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding devops_tutorial");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("devops_tutorial id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "devops_tutorial ID not found " + id
        };
      } else {
        response.message = doc.devops_comments ? doc.devops_comments : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};


//GET single devops_comment for a devops_tutorial
module.exports.devops_commentsGetOne = function(req, res) {
	var devops_tutorialId = req.params.devops_tutorialId; // extracting the url parameter....
	var devops_commentId = req.params.devops_commentId; 
	console.log("GET devops_commentId" + reviewId + "for devops_tutorialId" + devops_tutorialId);

	devops_tutorial
    .findById(devops_tutorialId)
    .select('devops_comments')
    .exec(function(err, devops_tutorial) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding devops_tutorial");
        response.status = 500;
        response.message = err;
      } else if(!devops_tutorial) {
        console.log("devops_tutorial id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "devops_tutorial ID not found " + id
        };
      } else {
        // Get the devops_comment
        response.message = devops_tutorial.devops_comments.id(devops_commentId);
        // If the devops_comment doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Devops_comment ID not found " + devops_commentId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });		
};




//Adding new devops_comment documents to devops_tutorial database...
  var _addDevops_comment = function (req, res, devops_tutorial) {
    
    devops_tutorial.devops_comments.push({
      name : req.body.name,
      devops_comment: req.body.devops_comment
    });

    devops_tutorial.save(function(err, devops_tutorialUpdated) {
      if (err) {
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(devops_tutorialUpdated.devops_comments[devops_tutorialUpdated.devops_comments.length - 1]);
      }
    });
  };


  module.exports.devops_commentsAddOne = function(req, res) {

    var id = req.params.devops_tutorialId; // extracting the url parameter....
    console.log('POST devops_comment to devops_tutorialId', id);

    devops_tutorial
      .findById(id)
      .select('devops_comments')
      .exec(function(err, doc) {
        var response = {
          status : 200,
          message : doc
        };
        if (err) {
          console.log("Error finding devops_tutorial");
          response.status = 500;
          response.message = err;
        } else if(!doc) {
          console.log("devops_tutorialId not found in database", id);
          response.status = 404;
          response.message = {
            "message" : "devops_tutorial ID not found " + id
          };
        }
        if (doc) {
          _addDevops_comment(req, res, doc);
        } else {
          res
            .status(response.status)
            .json(response.message);
        }
      });
    };

/*
  module.exports.reviewsUpdateOne = function(req, res) {
    var devops_tutorialId = req.params.devops_tutorialId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + devops_tutorialId);

    devops_tutorial
      .findById(devops_tutorialId)
      .select('reviews')
      .exec(function(err, devops_tutorial) {
        var thisReview;
        var response = {
          status : 200,
          message : {}
        };
        if (err) {
          console.log("Error finding devops_tutorial");
          response.status = 500;
          response.message = err;
        } else if(!devops_tutorial) {
          console.log("Hotel id not found in database", id);
          response.status = 404;
          response.message = {
            "message" : "Hotel ID not found " + id
          };
        } else {
          // Get the review
          thisReview = devops_tutorial.reviews.id(reviewId);
          // If the review doesn't exist Mongoose returns null
          if (!thisReview) {
            response.status = 404;
            response.message = {
              "message" : "Review ID not found " + reviewId
            };
          }
        }
        if (response.status !== 200) {
          res
            .status(response.status)
            .json(response.message);
        } else {
          thisReview.name = req.body.name;
          thisReview.rating = parseInt(req.body.rating, 10);
          thisReview.review = req.body.review;
          devops_tutorial.save(function(err, hotelUpdated) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res
                .status(204)
                .json();
            }
          });
        }
      });
    };


  module.exports.reviewsDeleteOne = function(req, res) {
    var hotelId = req.params.hotelId;  // extracting the url parameter....
    var reviewId = req.params.reviewId; // extracting the url parameter....
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

    Hotel
      .findById(hotelId)
      .select('reviews')
      .exec(function(err, hotel) {
        var thisReview;
        var response = {
          status : 200,
          message : {}
        };
        if (err) {
          console.log("Error finding hotel");
          response.status = 500;
          response.message = err;
        } else if(!hotel) {
          console.log("Hotel id not found in database", id);
          response.status = 404;
          response.message = {
            "message" : "Hotel ID not found " + id
          };
        } else {
          // Get the review
          thisReview = hotel.reviews.id(reviewId);
          // If the review doesn't exist Mongoose returns null
          if (!thisReview) {
            response.status = 404;
            response.message = {
              "message" : "Review ID not found " + reviewId
            };
          }
        }
        if (response.status !== 200) {
          res
            .status(response.status)
            .json(response.message);
        } else {
          hotel.reviews.id(reviewId).remove();
          hotel.save(function(err, hotelUpdated) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res
                .status(204)
                .json();
              }
          });
        }
      });
  };
  */