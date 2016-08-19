console.log("'graphs.js' connected");
var rawData;
var UniversalGraphHeight = 400;

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

  ////////DEX REDO check for existings graphs!!!!

  if(document.getElementsByTagName('svg').length > 0){
      var parentPie = document.getElementsByClassName("pieChart")[0];
      var childPie = document.getElementsByTagName("svg")[0];      
    
    var parentHisto = document.getElementsByClassName("ageHistogram")[0]; 
    var childHisto = document.getElementsByTagName("svg")[1];
    parentPie.removeChild(childPie);    
    parentHisto.removeChild(childHisto);  
  };

  if(document.getElementsByTagName("p").length > 0){
      for (var ip = 0; ip < document.getElementsByTagName("p").length; ip++) {
        // var childPiePar = document.getElementsByTagName("p")[0];
        document.getElementsByClassName("pieChart")[0].removeChild(document.getElementsByTagName("p")[0]);        
      };
   };   

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

        
    // var color = d3.scale.ordinal()
    //   .range(["red", "purple", "orange", "blue", "yellow"]);
    var color = d3.scale.category20b();
   
    console.log("Inside GenPie, pieData below ");
    console.log(pieData);

    var graphData = pieData,
        w = 350
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
      .attr("transform", "translate(20, 0)")
      .data(pie(graphData))
      .enter()
      .append('path')
      .attr('d', d3.svg.arc().innerRadius(0).outerRadius(0))
      .style("opacity", 0)
      .attr('fill', function(d, i) {
        return color(d.data.deaths);
      })
  .transition()
  .delay(100)
  .duration(1500)
      .style("opacity", 1)
      .attr('d', arc);

      ////LEGEND

    var legendRectSize = 18;
var legendSpacing = 4;

// var legend = canvas.selectAll('.legend')
//   .data(graphData)
//   .enter()
//   .append('g')
//   .attr('class', 'legend')
//   .attr('transform', function(d, i) {
//     var height = legendRectSize + legendSpacing;
//     var offset =  height * color.domain().length / 2;
//     var horz = -2 * legendRectSize;
//     var vert = i * height - offset;
//     return 'translate(' + horz + ',' + vert + ')';
//   });

//   legend.append('rect')
//   .attr('width', legendRectSize)
//   .attr('height', legendRectSize)
//   .style('fill', color)
//   .style('stroke', color);

//   legend.append('text')
//   .attr('x', legendRectSize + legendSpacing)
//   .attr('y', legendRectSize - legendSpacing)
//   .text(function(d) { return d.icd; });

var legend = canvas.selectAll('.legend')                     // NEW
          .data(color.domain())                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW
            var height = legendRectSize + legendSpacing;          // NEW
            var offset =  height * color.domain().length / 2;     // NEW
            var horz = -2 * legendRectSize;                       // NEW
            var vert = i * height - offset;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW

        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize)                         // NEW
          .style('fill', color)                                   // NEW
          .style('stroke', color);                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d,i) { return graphData[i].icd; });  







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

  
  var margin = {top: 60, right: 10, bottom: 50, left:70};
  var w = 700 - margin.right - margin.left,
      h = UniversalGraphHeight - margin.top - margin.bottom;   
 

  var histoData = [];
  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.icd == topStateIcd.icd){
      histoData.push(obj);
    };
  });

  if (histoData.length > 0) {

  
    // define x and y scales
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,w], 0, 0);

var yScale = d3.scale.linear()
    .range([h, 0]);   ///flip because y axis is inverted on page; larger y is down

// define x axis and y axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
    /*
    ========
              */

    console.log("This is the filtered histoData, below...")
    console.log(histoData);

    

    // specify domains of the x and y scales
    histoData.sort(function(a, b) { 
      return b.deaths - a.deaths;
    });
    yScale.domain([0, histoData[0].deaths]); 

    var graphData = histoData;
    var age_groupSort = histoData;

  age_groupSort.forEach(function(obj, index){
    switch(obj.age_group) {
      case "< 1 year":
          obj.sortVal = 1;
          break;
      case "1-4 years":
          obj.sortVal = 2;
          break;
      case "5-14 years":
          obj.sortVal = 3;
          break;
      case "15-24 years":
          obj.sortVal = 4;
          break;
      case "25-34 years":
          obj.sortVal = 5;
          break;
      case "35-44 years":
          obj.sortVal = 6;
          break;
      case "45-54 years":
          obj.sortVal = 7;
          break;
      case "55-64 years":
          obj.sortVal = 8;
          break; 
      case "65-74 years":
          obj.sortVal = 9;
          break;
      case "75-84 years":
          obj.sortVal = 10;
          break;
      case "85+ years":
          obj.sortVal = 11;
          break;  
    }
  });
  age_groupSort.sort(function(a, b) { 
      return a.sortVal - b.sortVal;
    });


  console.log("age_groupSort is below");
  console.log(age_groupSort);
    xScale.domain(age_groupSort.map(function(d) { return d.age_group; }) );  

  histoDataLength = histoData.length == 11 ? 11 : histoData.length;

  

  
  console.log("Inside GenHisto, histoData below ");
  console.log(histoData);

var canvas = d3.select(".ageHistogram")
  .append("svg")
  .attr ({
        "width": w + margin.right + margin.left,
        "height": h + margin.top + margin.bottom
      })
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.right + ")");


var graphBars = canvas.selectAll("rect")
  .data(graphData)
  .enter()
  .append("rect")
  .attr("height", 0)
    .attr("y", h)
    .transition().duration(3000)
    .delay( function(d,i) { return i * 200; })
    // attributes can be also combined under one .attr
    .attr({
      "x": function(d) { return xScale(d.age_group); },
      "y": function(d) { return yScale(d.deaths); },
      "width": xScale.rangeBand(),
      "height": function(d) { return  h - yScale(d.deaths); }
    })
    .style("fill", function(d,i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')'})
    .style("stroke", "black")
    .style("stroke-width", 2);


canvas.selectAll("text")
  .data(graphData)
  .enter()
  .append('text')
  .text(function(d){
      return d.deaths;
  })
  .attr({
      "x": function(d){ return xScale(d.age_group) +  xScale.rangeBand()/2; },
      "y": function(d){ return yScale(d.deaths)+ 12; },
      // "font-family": 'sans-serif',
      "font-size": '18px',
      "font-weight": 'bold',
      "fill": 'white',
      "text-anchor": 'middle'
  });

  canvas.append("g") //append  x axis 
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("dx", "-.8em")
    .attr("dy", ".25em")
    .attr("transform", "rotate(-60)" )
    .attr("fill", "#3DBE2E")
    .style("text-anchor", "end")
    .attr("font-size", "12px");

    var parenthIndex = topStateIcd.icd.indexOf("(");
          topStateIcdShort = topStateIcd.icd.slice(parenthIndex, topStateIcd.length);

  canvas.append("g") //append  y axis
    .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -h/2)
        .attr("font-size", "22px")
        .attr("dy", "-3em")
        .attr("fill", "#3DBE2E")
        .style("text-anchor", "middle")
        .text("Deaths by #1 State Cause");




    


  } else{
    d3.select(".ageHistogram")
    .append("p")
    .text("No results for this demo");

  };  
}
//////////////////////
//// END OF GenHisto
/////=============================================/////////






