//MAIN SERVER FILE
require('dotenv').config({silent: true});
var express     = require('express'),
    app         = express(),
    exphbs      = require('express-handlebars'),
    fs          = require('fs'),
    bodyParser  = require('body-parser');

/////////////////
////==SET VIEW ENGINE
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  partialsDir: __dirname + '/views/partials/',
  layoutsDir: __dirname + '/views/layouts/',
  extname: '.hbs'
}));
app.set('view engine', 'hbs'); //initiate view engine
app.set('views', __dirname + '/views'); //Set view directory
app.use(bodyParser.urlencoded({extended:true})); //prep body responses from DB
app.use(express.static(__dirname + '/public')); ///stactic elements directory

//////////////////////////
////==Connect database
require('./config/db');
///////////////////
////==Mount Middleware
app.use(require('./controllers/home'));

////////////////
////==START SERVER 
var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Server listening @: " + server.address().port);
});
/////

