require('./api/data/db.js'); // requiring the db.js methods...

var express = require('express'); // express  is require/brought in
var app = express();  // instantiate full express app... OR... initialising express to create application...
var path = require('path');  // path is set to send the file on rout..

var bodyParser = require('body-parser');

var routes = require('./api/routes');

// Define the port to run on
app.set('port', 3000);

// Middleware....In app.use the 'use' signifies that it is a milddleware...
/*Middleware get request from express and follow on go from one to the next to the next 
until it finaly gets a root or something that return  a respons.... And anybody gives a reponse then express will 
stop processing that request.........
   Means Middleware alows to interact with a request before response is given...
   Order is important in middleware....
   We can difine our middleware path for emaple-->
   app.use('/css',function(req, res, next) 
   The moddleware start from css folder...  */
// Add middleware to console log every request
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next(); 
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
/* setting the public folder as static means...when express recive request for a root the 1st thing is 
     going to do it is going to check to see wheather that root is atcually matched by any of the file within 
     a public folder....And if it finds a match it will deliver that file directly to the browser without any need
     add in any extra roots.
 */
app.use('/fonts', express.static(__dirname + '/fonts'));

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Add some routing
app.use('/api', routes);


// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
