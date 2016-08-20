// HomeController
// ==============
// Controller for the homepage.

var express         = require('express'),
    HomeController  = express.Router(),
    Stat            = require(__dirname + '/../models/stat'),
    fs              = require("fs");
////////

var testStats = fs.readFileSync('./formattedStats.json');
testStats = JSON.parse(testStats);

////
////////=======================
HomeController.route('/all/?')
// GET /
//get all stats
  .get(function(req, res) {
    Stat.find(function(err, stats) { //Find ALL stats within database
      res.json(stats);
    })
  })
    // POST /
  // load all stats to database
  .post(function(req, res, next) {
    console.log(testStats);
    Stat.create(testStats, function(err, gifts) {
    });
    res.render('home');
  })
  ///////delete all stats from database
  .delete(function(req, res, next) {
    Stat.remove({}, function(err,removed) {})
    res.json("Deleted everything")
  });
////=======================
HomeController.route('/?')
  // POST /
  // user posts form request
  .post(function(req, res, next) {
    var topState= [],
        leadByAge = [],
        userStats = [];

    Stat.find({state: req.body.state}, function(error, stateMatch) {
      if(error){console.log("Error: " + error);}
      else{
        for(var tsi = 0; tsi < stateMatch.length; tsi++) {  
            topState.push(stateMatch[tsi]);         
        };
      }
        res.json(topState);
    }); //end of Stat.find
    
    
  })//end of post
  // GET /
  // ------
  // load main page
  .get(function(req, res, next) {
    res.render('home');   
  });




//////
module.exports = HomeController;
