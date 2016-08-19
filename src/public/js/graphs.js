var rawData;
var UniversalGraphHeight = 400;

$('form').submit(function(event){
  event.preventDefault();

///initiate call to my databse of deaths stats
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
      rawData = responseData;
      GenPie(rawData);     
    },
    error: function(error){
      return res.json( error);
    }  
  })  
});

/////=============================================/////////
////START of GenPie: generate pie graph
//////////////////

function GenPie(rawData) {
  var pieData = [];

  /////format data sets for men vs women for top causes
  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()){
      pieData.push(obj);
    
    };
  });

  //////// check for existings graphs or warnings
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
    pieData.sort(function(a, b) { 
      return b.deaths - a.deaths;
    });

    var topStateIcd = pieData[0];
    var radius = 150;

    pieDataLength = pieData.length >= 5 ? 5 : pieData.length;

    pieData = pieData.slice(0, pieDataLength);


    // var color = d3.scale.ordinal()
    //   .range(["#1F7F14", "#1414FF", "cyan", "#3B60E4", "#5544BF"]);

      var color = d3.scale.ordinal()
      .range(["#1111FF", "#2306C2", "#263F9E", "#5544BF", "#563491"]);

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

var legend = canvas.selectAll('.legend')                   
          .data(color.domain())                                 
          .enter()                                              
          .append('g')                                          
          .attr('class', 'legend')                              
          .attr('transform', function(d, i) {                   
            var height = legendRectSize + legendSpacing;        
            var offset =  height * color.domain().length / 10;   
            var horz = -3 * legendRectSize;                     
            var vert = i * height - offset + 150;                     
            return 'translate(' + (2.5 * horz) + ',' + vert + ')';      
          });                                                   

        legend.append('rect')                                   
          .attr('width', legendRectSize)                        
          .attr('height', legendRectSize)                       
          .style('fill', color)                                 
          .style('stroke', "black");                              
          
        legend.append('text')                                   
          .attr('x', legendRectSize + legendSpacing)            
          .attr('y', legendRectSize - legendSpacing)  
          .attr("fill", "#3DBE2E")
          .attr("font-size", "16px")
          .attr("font-weight", "bolder")
          .text(function(d,i) { return graphData[i].icd.slice(7, graphData[i].icd.length); });


      GenHisto(rawData, topStateIcd);
  
    } /////end of if true case for results exist
  else{
      d3.select(".pieChart")
      .append("p")
      .text("No results for this demographic");

  };  
} 
///////
//////=============
///// GENERATE HISTOGRAM  
  
function GenHisto(rawData, topStateIcd) {

  
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


    xScale.domain(age_groupSort.map(function(d) { return d.age_group; }) );  

  histoDataLength = histoData.length == 11 ? 11 : histoData.length;

  

  

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
      "fill": '#CCC0CB',
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






