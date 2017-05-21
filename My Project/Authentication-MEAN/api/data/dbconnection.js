
var MongoClient = require('mongodb').MongoClient;   // requiring native driver(MongoClient class diver)......
//Building connection string for the database
var dburl = 'mongodb://localhost:27017/meanhotel';   

var _connection = null;

// seting connection...
var open = function() {
  MongoClient.connect(dburl, function(err, db) {
    if (err) {
      console.log("DB connection failed");
      return;
    }
    _connection = db;
    console.log("DB connection open");
  });
};

var get = function() {
  return _connection;
};

//Exporting get and open methods
module.exports = {
  open : open,
  get : get
};