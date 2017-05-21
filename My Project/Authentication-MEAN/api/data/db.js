var mongoose = require('mongoose');
//Building connection string for the database
mongoose.Promise = global.Promise;
var dburl = 'mongodb://localhost:27017/meanhotel';
var retry = null;

mongoose.connect(dburl); // Connecting daatabase in mongoose......

/* Like MongoDB, Mongoose does not have callback function for diffirent cases.
  Actually It exposes events for different cases like connected, disconnected or Error...*/

 // Connection Events...
// For successful connection event....
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dburl);
});

// For Disconnection event....
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

// For Error event....
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});


// This process is fire when we do Ctrl+c to kill the current process in command line...
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGINT)');
		process.exit(0);
	});
});

// This process is fire when we restart current process by command 'rs' in command line...
process.on('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});

process.once('SIGUSR2', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGUSR2)');
		process.kill(process.pid, 'SIGUSR2');
	});
});

//Bringing in Hotel shcemas and Models
require('./hotels.model.js');

//Bringing in user shcemas and Models
require('./users.model.js');