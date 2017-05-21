var mongoose = require('mongoose');
var User     = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs'); 
var jwt    = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
    user: 'vchnadrak425@gmail.com',
    pass: 'vikdonoo7'
}
});


//--------------------------------------Registresion Controller---------------------------------------------------------------------//

module.exports.register = function(req, res) {
	console.log('Register user');
    
	var username = req.body.username;
	var name	 = req.body.name;
	var email	 = req.body.email;
	var password = req.body.password;
    var temporarytoken = jwt.sign({username: req.body.username, name: req.body.name}, 's3cr3t', {expiresIn: 3600});
    console.log(temporarytoken);
	User.create({
		username: username,
		name    : name,
		email	: email,
		temporarytoken: temporarytoken,
		password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	}, function(err, User){
		if(err){
				res.status(401).json({success: false, message: 'User Already exist.'});
		} else{

		transporter.sendMail({
		    from: '"Tutorial Shaala" <vchnadrak425@gmail.com>',
		    to: email,
		    subject: 'Tutorial Shaala activation',
		    text: 'Hello ' + name + ',Thank you for Registering at TutorialShaala.com. Please clcik on the link to complete your activation : http://localhost:3000/activate/' + temporarytoken,
		    html: 'Hello<strong> ' + name + '</strong>,<br><br>Thank you for Registering at TutorialShaala.com. Please clcik on the link below to complete your activation :<br><br><a href="http://localhost:3000/activate/' + temporarytoken + '">http://localhost:3000/activate/</a>' 
		},function(err, User){
			if(err){
				res.status(401).json(err);
			} else{
				console.log('Message has been send');
					res.status(200).json({ success: true, message: 'Account is successfully Registered! Activation link has been sent to ' + email + '!'})
			}
		});
			console.log('Account is successfully Registered! Activation link to activate your account...');
		 res.status(200).json({ success: true, message: 'Account is successfully Registered! Activation link has been sent to ' + email + '!'});
		}
	});
};



//--------------------------------------Login Controller---------------------------------------------------------------------//

module.exports.login = function(req, res) {
	console.log('logging in user');
	var username = req.body.username;
	var password = req.body.password;
	//var email	=  req.body.email;
	User.findOne({
		username: username
		//email	: email
	}, function(err, User){

		if(err){
			console.log(err);
			res.status(400).json(err);
		} else if(!User){
                console.log('User Not Found with username: '+username);
                res.status(400).json({ success: false, message: 'User does not exist!' });
        } else if(!User.active){
                console.log('User Not activated account');
                res.status(400).json({ success: false, message: 'User Not activated account Please check your e-mail Account for Activation link!', expired: true });
            }
		else{
			if(bcrypt.compareSync(password, User.password)){
				console.log('User found', User);
				var token = jwt.sign({username: User.username, name: User.name}, 's3cr3t', {expiresIn: 3600});
					res.status(200).json({ success: true, message: 'User Authenticated!', token: token });
			} else{
				   console.log('Unauthorized');
				   res.status(401).json({ success: false, message: 'Worng Password Please Try Again!' });
			}
		}
	});
};


//------------------------------------------User Activation Controller---------------------------------------------//


module.exports.activation = function(req, res){
	  console.log('user activation');
      var temporarytoken = req.params.token;
        User.findOne({temporarytoken: temporarytoken}, function(err, User){
			if(err){
				console.log(err);
					res.status(400).json(err);
			} else {

            	var token = req.params.token; 
         		jwt.verify(token, 's3cr3t', function(err, decoder){
			    if(err){
				    res.status(401).json({success: false, message: 'Activation link has expired!'});
			     } else if(!User){
                     res.status(401).json({success: false, message: 'Activation link has expired!'});	
			     } else {
		               User.temporarytoken = false;
		               User.active = true;
		               console.log('succeeds');
		               // Mongoose Method to save user into the database
		               	User.save(function(err) {
						if (err) {
							console.log(err); // If unable to save user, log error info to console/terminal
						} else {
							// If save succeeds, create e-mail object
						transporter.sendMail({
							    from: '"Tutorial Shaala" <vchnadrak425@gmail.com>',
							    to: User.email,
							    subject: 'Tutorial Shaala activation',
							    text: 'Hello ' + User.username + ', Your account has been successfully activated at TutorialShaala...',
								html: 'Hello<strong> ' + User.username + '</strong>,<br><br>Your account has been successfully activated at TutorialShaala...'
							  },function(err, User){
								if(err){
									res.status(401).json(err);
								} else{
									console.log('Confermation Message has been send ');
										res.status(200).json(data)
									}
								});
							}
						});
	               	   res.status(200).json({success: true, message: 'Your Account is successfully activated Please login...'}); // Return success message to controller
					}
	        	});

		 	}
	    });
    }
	

//----------------------------------------------------Re-sending Activation Link Controller-------------------------------------------------------//

// Route to verify user credentials before re-sending a new activation link	
	module.exports.post_resend = function(req, res){
		var username = req.body.username;
	    var password = req.body.password;
		User.findOne({ username: req.body.username }).select('username password active')
		.exec(function(err, user) {
			if (err) throw err; // Throw error if cannot connect

			// Check if username is found in database
			if (!user) {
				res.status(400).json({ success: false, message: 'Could not authenticate user!' }); // Username does not match username found in database
			} else if (user) {

				// Check if password is sent in request
				if (req.body.password) {
					var validPassword = bcrypt.compareSync(password, user.password) // Password was provided. Now check if matches password in database
					if (!validPassword) {
						res.status(401).json({ success: false, message: 'Could not authenticate password!' }); // Password does not match password found in database
					} else if (user.active) {
						res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
					} else {
						res.status(200).json({ success: true, user: user });
					}
				} else {
					res.status(400).json({ success: false, message: 'No password provided!' }); // No password was provided
				}
			}
		});
	}

// Route to send user a new activation link once credentials have been verified
	module.exports.put_resend = function(req, res){
		User.findOne({ username: req.body.username }).select('username name email temporarytoken')
		.exec(function(err, user) {
			if (err) throw err; // Throw error if cannot connect
			user.temporarytoken = jwt.sign({username: req.body.username, name: req.body.name}, 's3cr3t', {expiresIn: 3600}); // Give the user a new token to reset password
			// Save user's new token to the database
			user.save(function(err) {
				if (err) {
					console.log(err); // If error saving user, log it to console/terminal
				} else {
					// If user successfully saved to database, create e-mail object
					transporter.sendMail({
						    from: '"Tutorial Shaala" <vchnadrak425@gmail.com>',
						    to: user.email,
						    subject: 'TutorialShaala Activation Link Request',
						    text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:3000/activate/' + user.temporarytoken,
						    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:3000/activate/' + user.temporarytoken + '">http://localhost:3000/activate/</a>'
					    },function(err, User){
							if(err){
								res.status(401).json(err);
							} else{
								console.log('Message has been send');
									res.status(200).json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' })
							}
						});
					res.status(200).json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
				}
			});
		});
	}


//-------------------------------------------User Resetpassword Controller-------------------------------------------------------------//

// Route to send reset link to the user
	module.exports.put_resetpassword = function(req, res){
		User.findOne({ username: req.body.username }).select('username active email resettoken name')
		.exec(function(err, user) {
			if (err) {
			    console.log(err);
				res.status(400).json(err);  // Throw error if cannot connect 
			} else{ 
				if (!user) {
					res.status(401).json({ success: false, message: 'Username does not exist!' }); // Return error if username is not found in database
				} else if (!user.active) {
					res.status(400).json({ success: false, message: 'Account has not yet been activated!' }); // Return error if account is not yet activated
				} else {
					user.resettoken = jwt.sign({username: req.body.username, name: req.body.name}, 's3cr3t', {expiresIn: 3600}); // Create a token for activating account through e-mail
					// Save token to user in database
					user.save(function(err) {
						if (err) {
							res.status(400).json({ success: false, message: err }); // Return error if cannot connect
						} else {
							// Create e-mail object to send to user
	                       transporter.sendMail({
							    from: '"Tutorial Shaala" <vchnadrak425@gmail.com>',
							    to: user.email,
							    subject: 'TutorialShaala Reset Password Request',
						        text: 'Hello ' + user.name + ', You recently requested a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/reset/' + user.resettoken,
								html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/reset/' + user.resettoken + '">http://localhost:3000/reset/</a>'
						    },function(err, User){
								if(err){
									res.status(401).json(err);
								} else{
									console.log('Reset Password Request has been send');
										res.status(200).json({ success: true, message: 'Password reset link has been sent to ' + user.email + '!' })
								}
							});

							res.status(200).json({ success: true, message: 'Password reset link has been sent to ' + user.email + '!' }); // Return success message
						}
					});
				}
		  }
		});
	};
  
// Route to verify user's e-mail activation link
	module.exports.get_resetpassword = function(req, res){
		User.findOne({ resettoken: req.params.token }).select()
		.exec(function(err, user) {
			if (err){
				res.status(400).json({ success: false, message: err }); // Return error if cannot connect
			} else {
			var token = req.params.token; // Save user's token from parameters to variable
			// Function to verify token
			jwt.verify(token, 's3cr3t', function(err, decoded) {
				if (err) {
					res.status(400).json({ success: false, message: 'Password reset link has expired!' }); // Token has expired or is invalid
				} else {
					if (!user) {
						res.status(400).json({ success: false, message: 'Password reset link has expired!' }); // Token is valid but not no user has that token anymore
					} else {
						res.status(200).json({ success: true, user: user }); // Return user object to controller
					}
				}
			});
		  }
		});
	};

// Save user's new password to database
	module.exports.savepassword = function(req, res){
		User.findOne({ username: req.body.username }).select('username email name password resettoken')
		.exec(function(err, user) {
			if (err){
				res.status(400).json({ success: false, message: err }); // Return error if cannot connect
			} else {
              if (!user) {
					res.status(401).json({ success: false, message: 'Username does not exist!' }); // Return error if username is not found in database
			} else if (req.body.password == null || req.body.password == '') {
				res.json({ success: false, message: 'Password not provided!' });
			} else {
				user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // Save user's new password to the user object
				user.resettoken = false; // Clear user's resettoken 
				// Save user's new data
				user.save(function(err) {
					if (err) {
						res.json({ success: false, message: err });
					} else {
						// Create e-mail object to send to user
                      transporter.sendMail({
						    from: '"Tutorial Shaala" <vchnadrak425@gmail.com>',
						    to: user.email,
						    subject: 'TutorialShaala Reset Password Request',
						    text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at TutorialShaala.com',
							html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at TutorialShaala.com'					        
					    },function(err, User){
							if(err){
								res.status(401).json(err);
							} else{
								console.log('Password has been successfully reset! Please login...');
									res.status(200).json({ success: true, message: 'Password has been successfully reset! Please login...' })
							}
						});
						res.status(200).json({ success: true, message: 'Password has been successfully reset! Please login...' }); // Return success message
					}
				});
			}
        }

		});
	};






//-------------------------------------------User Authentication Controller-------------------------------------------------------------//


module.exports.authenticate = function(req, res, next){
	var headerExists = req.header.authorization;
		if(headerExists){
			var token = req.header.authorization.split(' ')[1];
			jwt.verify(token, 's3cr3t', function(err, decoder){
				if(err){
					res.status(401).json('Unauthorized');
				} else{
					req.user = decoder.username;
					next();
					
				}
			});
		} else{
			res.status(403).json('No token provied');
		}
};