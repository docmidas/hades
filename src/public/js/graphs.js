console.log("connected");

var dexTarget = (document.getElementsByClassName("results")[0].textContent);
dexTarget = JSON.parse(dexTarget);

console.log(dexTarget);

pieData = dexTarget;

// d3.select(".pieChart")
//   .append("p")
//   .text("FINALLY got some D3!");

//===============
//  var orangeData = [10, 30, 50, 100]; 

// var canvas = d3.select(".pieChart")
//   .append("svg")
//   .attr("width", 768)
//   .attr("height", 200);

// var oranges = canvas.selectAll("circle")
//   .data(orangeData)
//   .enter()
//   .append("circle")
//   .attr("fill", "orange")
//   .attr("cx", function(d, i) {
//     return d + (i * 100);
//   })
//   .attr("cy", function(d) {
//     return d;
//   })
//   .attr("r", function(d) {
//     return d;
//   });
  //==============
  ///HISTOGRAM

  var graphData = [1, 800, 1200],
      w = 800
      h = 800; 

  var scaling = d3.scale.linear()
    .domain([0, 1200])
    .range([0, w]);

 var axis = d3.svg.axis()
  .ticks(5)
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
  .attr("width", function(d) {
    return scaling(d);
  })
  .attr("height", 20)
  .attr("y", function(d, i) {
    return i * 50;
  });

  canvas.append("g") //append axis 
    .attr("transform", "translate(0,200)")
    .call(axis);












