console.log("'graphs.js' connected");
var rawData;
var UniversalGraphHeight = 330;

$('form').submit(function(event){
  event.preventDefault();
  // console.log("INPUT" + $('input[name="state"]').val());
  // console.log("LABEL" + $('label[name="state"]').val());
  // console.log("SELECT" + $('select[name="state"]').val());

  $.ajax({
    type: 'post',
    url: "http://localhost:3000/",
    data: {
      state: $('select[name="state"]').val(),
      gender: $('select[name="gender"]').val(),
      age_group: $('select[name="age_group"]').val()
    },
    dataType: 'json',
    success: function(responseData){
      console.log("post request SUCCESSFUL");
      rawData = responseData;
      //console.log(rawData); 
      //console.log("jusr b4 GenHisto, histoData: " + histoData);
      GenPie(rawData);
      //GenRadar(rawData);      
    },
    error: function(error){
      return console.log("There was an error: " + error);
    }  
  })  
});

/////=============================================/////////
////START of GenPie
//////////////////

function GenPie(rawData) {
  console.log("Inside GenPie");
  console.log("This is rawData length " + rawData.length)
  var pieData = [];

  /////format data sets for men vs women for top causes
  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()){
      pieData.push(obj);
      //console.log(obj);
    };
  });

    //////TEST pieData
   //pieData = [300, 60, 156, 175, 80];

  ////check for data, then graph it
  if (pieData.length > 0) { 

    console.log("This is the filtered pieData, below...")
    console.log(pieData);


    pieData.sort(function(a, b) { 
      return b.deaths - a.deaths;
    });

    var topStateIcd = pieData[0];
    console.log("topStateIcd follows....")
    console.log(topStateIcd)

     var radius = 150;

    pieDataLength = pieData.length >= 5 ? 5 : pieData.length;

    pieData = pieData.slice(0, pieDataLength);

        
    var color = d3.scale.ordinal()
      .range(["red", "purple", "orange", "blue", "yellow"]);
   
    console.log("Inside GenPie, pieData below ");
    console.log(pieData);

    var graphData = pieData,
        w = 500
        h = UniversalGraphHeight; 
  


    var canvas = d3.select(".pieChart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(150, 150)");

    var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(radius);  
   

    var pie = d3.layout.pie()
      .value(function(d) {return d.deaths});
      //.value(function(d) {return d});

    var path = canvas.selectAll('path')
      .data(pie(graphData))
      .enter()
      .append('path')
      .attr('d', d3.svg.arc().innerRadius(0).outerRadius(0))
      // .style("opacity", 0)
      .attr('fill', function(d, i) {
        return color(d.data.deaths);
      })
  .transition()
  .delay(1100)
  .duration(1500)
      // .style("opacity", 1)
      .attr('d', arc);

      GenHisto(rawData, topStateIcd);
  
    } /////end of if true case for results exist
  else{
      d3.select(".pieChart")
      .append("p")
      .text("No results for this demo");

  };  
} 
///////
//////=============
/////HISTOGRAM  
  
function GenHisto(rawData, topStateIcd) {
  console.log("Inside GenHisto");
  console.log("This is rawData length " + rawData.length)
  console.log("topStateIcd follows");
  console.log(topStateIcd);

  
  // console.log(document.getElementsByTagName('svg')[0] == true);
  // console.log($('select[name="gender"]').val());
  // console.log($('select[name="age_group"]').val());

  // function filterByDem(obj) {
  //   if (obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()) {
  //     return true;
  //   }
  // }
  // var filteredArray = histoData.filter(filterByDem);

////////DEX REDO check for existings graphs!!!!

  // if(document.getElementsByTagName('svg').length > 0){
  //   var parent = document.getElementsByClassName("ageHistogram")[0];
  //   var child = document.getElementsByTagName("svg")[0];
  //   var childRadar = document.getElementsByTagName("svg")[1];
  //   parent.removeChild(child); 
  //   var parentRadar = document.getElementsByClassName("radar")[0];
  //   parentRadar.removeChild(childRadar);    
  // }

  var histoData = [];

  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.icd == topStateIcd.icd){
      histoData.push(obj);
      //console.log(obj);
    };
  });

  if (histoData.length > 0) {

    // for(var property in e) {
    //   if(e.gender == $('select[name="gender"]').val() && e.age_group == $('select[name="age_group"]').val()){
    //     histoData.push(e);
    //   }
    // };
  

console.log("This is the filtered histoData, below...")
console.log(histoData);



  histoData.sort(function(a, b) { 
    return b.deaths - a.deaths;
});

  // histoDataLength = histoData.length >= 5 ? 5 : histoData.length;
  histoDataLength = histoData.length == 11 ? 11 : histoData.length;


  //histoData = histoData.slice(0, histoDataLength); ////  no longer slicing
  // var graphData = [1, 800, 1200],
  console.log("Inside GenHisto, histoData below ");
  console.log(histoData);
  var graphData = histoData,
      w = window.innerWidth / 2.6,
      h = UniversalGraphHeight; 


  var scaling = d3.scale.linear()
    .domain([graphData[histoDataLength-1].deaths >= 100 ? graphData[histoDataLength-1].deaths - 100 : 0,  graphData[0].deaths * 1.1])
    .range([h, 0]);

   var yScale = d3.scale.linear()
    .range([200, 0]); 

    yScale.domain([0, graphData[0].deaths]);

    graphData.sort(function(a, b) { 
      return a.age_group - b.age_group;
    });

 var axis = d3.svg.axis()
  .ticks(6)
  .scale(scaling);  

var canvas = d3.select(".ageHistogram")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "translate(30, 20)");


var graphBars = canvas.selectAll("rect")
  .data(graphData)
  .enter()
  .append("rect")
  .attr("fill", "pink")
  .attr("width", 15)
  .attr("height", 0)
  .attr("y", 200) 
  .transition()
  .duration(1300)
  .delay(500)
    //.delay( function(d,i) { return i * 200; })
  .attr("height", function(d) {
    return 200 - yScale(d.deaths);
    //console.log(d.deaths);
    //return (d.deaths);
  })
  .attr("x", function(d, i) {
    return i * 40;
  });


canvas.selectAll("text")
  .data(graphData)
  .enter()
  .append("text")
  .attr("fill", "blue")
  .transition()
  .delay(1500)
  .attr("x", function(d, i) {
    return (i * 40) + 15;
  })
  .attr("y", 5)
  .text(function(d) {
    return d.age_group + " Deaths: " + d.deaths;
  });

  canvas.append("g") //append axis 
    .attr("transform", "translate(0,200)")
    .call(axis);

    //GenPie(rawData);


  } else{
    d3.select(".ageHistogram")
    .append("p")
    .text("No results for this demo");

  };  
}
//////////////////////
//// END OF GenHisto
/////=============================================/////////






