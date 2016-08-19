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

        // console.log("topState's start type " + (typeof topState));
       
      //query on state  
      console.log("==========POST req begins here========")
      console.log(req.body.state);
      console.log(req.body.age_group);
      console.log(req.body.gender);

    Stat.find({state: req.body.state}, function(error, stateMatch) {
      if(error){console.log("Error: " + error);}
      else{
        for(var tsi = 0; tsi < stateMatch.length; tsi++) {  
            topState.push(stateMatch[tsi]);         
        };
        console.log("Length of results, based on STATE, below with NO DELAY");
        console.log(topState.length);

        // res.render('home', {topState: stringResults});
        //res.json(topState);
        //res.json([topState, ]);
      }

        //query on state and age
        // Stat.find({state: req.body.state, age_group: req.body.age_group}, function(error, ageMatch) {     
        //   for(var ageIndex = 0; ageIndex < ageMatch.length; ageIndex++) {        
        //       leadByAge.push(ageMatch[ageIndex]);         
        //   };
        // })
        // ///query against state, age, sex
        // Stat.find({state: req.body.state, age_group: req.body.age_group, gender: req.body.gender}, function(error, statList) {     
        //   for(var si = 0; si < statList.length; si++) {        
        //       userStats.push(statList[si]);         
        //   };
        // })
    

        //res.render('home', {topState: topState, leadByAge: leadByAge, userStats: userStats});
        res.json(topState);
    }); //end of Stat.find
    
    
  })//end of post
  // GET /
  // ------
  // load main page
  .get(function(req, res, next) {
    // res.render('profile', {gift: userStats, isLoggedIn: req.session.isLoggedIn ? true : false });
    res.render('home');
    console.log("There was a GET req");    
  });




//////
module.exports = HomeController;
