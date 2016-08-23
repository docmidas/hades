var mongoose = require('mongoose');

//var connectionString = 'mongodb://localhost/stats';
var connectionString = process.env.NODE_ENV === 'production' ? 'mongodb://hexadeximal:D3ximuspr!me@ds013956.mlab.com:13956/hades' : 'mongodb://localhost/stats';



mongoose.connect(connectionString);

mongoose.connection.on("connected", function() {
  console.log("mongoose connected to: " + connectionString);
});

mongoose.connection.on("error", function(err) {
  console.log("HEYO mongoose failed to connect to: " + connectionString);
});

mongoose.connection.on("disconnected", function() {
  console.log("mongoose has been disconnected from: " + connectionString);
});
