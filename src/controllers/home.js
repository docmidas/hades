// HomeController
// ==============
// Controller for the homepage.

var express         = require('express'),
    HomeController  = express.Router(),
    Stat            = require(__dirname + '/../models/stat'),
    fs              = require("fs");
////////

// var testStats = [{"state":"Alabama (01)","age_group":"< 1 year","icd":"P00-P04 (Newborn affected by maternal factors and by complications of pregnancy, labour and delivery)","gender":"Female","deaths":18,"population":28346},
// {"state":"Alabama (01)","age_group":"< 1 year","icd":"P00-P04 (Newborn affected by maternal factors and by complications of pregnancy, labour and delivery)","gender":"Male","deaths":12,"population":29508}];

var testStats = fs.readFileSync('./sampleData.json');
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
  .delete(function(req, res, next) {
    Stat.remove({}) {
        res.json({message: "Deleted all entries, I think "});
      };    
  });
////=======================  



HomeController.route('/?')
  // POST /
  // load stats to database
  .post(function(req, res, next) {
    console.log(testStats);
    Stat.create(testStats, function(err, gifts) {
    });
    res.render('home');
  })
  // GET /
  // ------
  // get stats, based on state, age_group, and gender
  .get(function(req, res, next) {
    var userStats = []; 
    Stat.find({state: req.body.state, age_group: req.body.age_group, gender: req.body.gender}, function(error, statList) {     
      for(var si = 0; si < statList.length; si++) {        
          userStats.push(statList[si]);         
      };
    })
    // res.render('profile', {gift: userStats, isLoggedIn: req.session.isLoggedIn ? true : false });
    console.log("There was a GET req");    
  });




//////
module.exports = HomeController;
