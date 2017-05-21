var express = require('express'); // express  is require/brought in
var router = express.Router();  // instantiate express Router...from express.....

var ctrlHotels  = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers   = require('../controllers/users.controllers.js');

// Hotel routes
router
  .route('/hotels')
  .get(ctrlHotels.hotelsGetAll)
  .post(ctrlHotels.hotelsAddOne);

router
  .route('/hotels/:hotelId')
  .get(ctrlHotels.hotelsGetOne)
  .put(ctrlHotels.hotelsUpdateOne)
  .delete(ctrlHotels.hotelsDeleteOne);

// Review routes
router
  .route('/hotels/:hotelId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
  .route('/hotels/:hotelId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

//Authentication routes
router
  .route('/users/register')
  .post(ctrlUsers.register);

router
  .route('/users/login')
  .post(ctrlUsers.login);  

module.exports = router; // exporting the router