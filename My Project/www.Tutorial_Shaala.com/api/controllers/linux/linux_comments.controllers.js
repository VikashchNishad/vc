
var mongoose = require('mongoose'); // requiring the Mongoose driver...
var linux_tutorial = mongoose.model('linux_tutorial'); // Referencing the model...

// GET all linux_comments for a linux_tutorial hotel
module.exports.linux_commentsGetAll = function(req, res) {
  var id = req.params.linux_tutorialId;  // extracting the url parameter....
  console.log('GET linux_comments for linux_tutorialId', id);
 
  linux_tutorial
    .findById(id)
    .select('linux_comments')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding linux_tutorial");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("linux_tutorial id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "linux_tutorial ID not found " + id
        };
      } else {
        response.message = doc.linux_comments ? doc.linux_comments : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};


//GET single linux_comment for a linux_tutorial
module.exports.linux_commentsGetOne = function(req, res) {
	var linux_tutorialId = req.params.linux_tutorialId; // extracting the url parameter....
	var linux_commentId = req.params.linux_commentId; 
	console.log("GET linux_commentId" + reviewId + "for linux_tutorialId" + linux_tutorialId);

	linux_tutorial
    .findById(linux_tutorialId)
    .select('linux_comments')
    .exec(function(err, linux_tutorial) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding linux_tutorial");
        response.status = 500;
        response.message = err;
      } else if(!linux_tutorial) {
        console.log("linux_tutorial id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "linux_tutorial ID not found " + id
        };
      } else {
        // Get the linux_comment
        response.message = linux_tutorial.linux_comments.id(linux_commentId);
        // If the linux_comment doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Linux_comment ID not found " + linux_commentId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });		
};




//Adding new linux_comment documents to linux_tutorial database...
  var _addLinux_comment = function (req, res, linux_tutorial) {
    
    linux_tutorial.linux_comments.push({
      name : req.body.name,
      linux_comment: req.body.linux_comment
    });

    linux_tutorial.save(function(err, linux_tutorialUpdated) {
      if (err) {
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(linux_tutorialUpdated.linux_comments[linux_tutorialUpdated.linux_comments.length - 1]);
      }
    });
  };


  module.exports.linux_commentsAddOne = function(req, res) {

    var id = req.params.linux_tutorialId; // extracting the url parameter....
    console.log('POST linux_comment to linux_tutorialId', id);

    linux_tutorial
      .findById(id)
      .select('linux_comments')
      .exec(function(err, doc) {
        var response = {
          status : 200,
          message : doc
        };
        if (err) {
          console.log("Error finding linux_tutorial");
          response.status = 500;
          response.message = err;
        } else if(!doc) {
          console.log("linux_tutorialId not found in database", id);
          response.status = 404;
          response.message = {
            "message" : "linux_tutorial ID not found " + id
          };
        }
        if (doc) {
          _addLinux_comment(req, res, doc);
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