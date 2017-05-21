var express = require('express');
var router = express.Router();

var ctrlDevops_tutorials  = require('../controllers/devops/devops_tutorials.controllers.js');
var ctrlDevops_comments  = require('../controllers/devops/devops_comments.controllers.js');

var ctrlLinux_tutorials  = require('../controllers/linux/linux_tutorials.controllers.js');
var ctrlLinux_comments  = require('../controllers/linux/linux_comments.controllers.js');

var ctrlContact = require('../controllers/contact.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');


//------------------------------------------------------------------------------------------------
// devops_tutorials routes
router
  .route('/devops_tutorials')
  .get(ctrlDevops_tutorials.devops_tutorialsGetAll)
  .post(ctrlDevops_tutorials.devops_tutorialsAddOne);

router
  .route('/devops_tutorials/:devops_tutorialId')
  .get(ctrlDevops_tutorials.devops_tutorialsGetOne)
  
  .delete(ctrlDevops_tutorials.devops_tutorialsDeleteOne);

// Devops_comment routes
router
  .route('/devops_tutorials/:devops_tutorialId/devops_comments')
  .get(ctrlDevops_comments.devops_commentsGetAll)
  .post(ctrlDevops_comments.devops_commentsAddOne);

router
  .route('/devops_tutorials/:devops_tutorialId/devops_comments/:devops_commentId')
  .get(ctrlDevops_comments.devops_commentsGetOne);

//----------------------------------------------------------------------------------------------
// linux_tutorials routes
router
  .route('/linux_tutorials')
  .get(ctrlLinux_tutorials.linux_tutorialsGetAll)
  .post(ctrlLinux_tutorials.linux_tutorialsAddOne);

router
  .route('/linux_tutorials/:linux_tutorialId')
  .get(ctrlLinux_tutorials.linux_tutorialsGetOne)
  .delete(ctrlLinux_tutorials.linux_tutorialsDeleteOne);

// Linux_comment routes
router
  .route('/linux_tutorials/:linux_tutorialId/linux_comments')
  .get(ctrlLinux_comments.linux_commentsGetAll)
  .post(ctrlLinux_comments.linux_commentsAddOne);

router
  .route('/linux_tutorials/:linux_tutorialId/linux_comments/:linux_commentId')
  .get(ctrlLinux_comments.linux_commentsGetOne);
 



//-----------------------------------------------------------------------------------------------//

router.route('/contact').post(ctrlContact.send_mail);

//-------------------------------------Users Route----------------------------------------------//

router.route('/activate/:token').put(ctrlUsers.activation);
router.route('/resend').post(ctrlUsers.post_resend);
router.route('/resend').put(ctrlUsers.put_resend);

router.route('/resetpassword').put(ctrlUsers.put_resetpassword);
router.route('/resetpassword/:token').get(ctrlUsers.get_resetpassword);
router.route('/savepassword').put(ctrlUsers.savepassword);

//----------------------------------------------------------------------------------------------//
router.route('/users/register').post(ctrlUsers.register);
router.route('/users/login').post(ctrlUsers.login);


module.exports = router;



