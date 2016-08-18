console.log("'graphs.js' connected");
var rawData;

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
      //console.log("jusr b4 GenGraphs, histoData: " + histoData);
      GenGraphs(rawData);       
    },
    error: function(error){
      return console.log("There was an error: " + error);
    }  
  })
  
});
  


//////===========PIE CHART
// d3.select(".pieChart")
//   .append("p")
//   .text("FINALLY got some D3!");
//////=============
/////HISTOGRAM  
  
function GenGraphs(rawData) {
  console.log("Inside GenGraphs");
  console.log("This is rawData length " + rawData.length)
  
  // console.log(document.getElementsByTagName('svg')[0] == true);
  // console.log($('select[name="gender"]').val());
  // console.log($('select[name="age_group"]').val());

  // function filterByDem(obj) {
  //   if (obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()) {
  //     return true;
  //   }
  // }
  // var filteredArray = histoData.filter(filterByDem);


  if(child = document.getElementsByTagName('svg').length > 0){
    var parent = document.getElementsByClassName("ageHistogram")[0];
    var child = document.getElementsByTagName("svg")[0];
    parent.removeChild(child);    
  }

  var histoData = [];

  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()){
      histoData.push(obj);
      //console.log(obj);
    };
  });

  if (histoData.length > 0) {
    

  //   console.log(index);

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

  histoDataLength = histoData.length >= 5 ? 5 : histoData.length;



  histoData = histoData.slice(0, histoDataLength);
  // var graphData = [1, 800, 1200],
  console.log("Inside GenGraphs, histoData below ");
  console.log(histoData);
  var graphData = histoData,
      w = 500
      h = 250; 


  var scaling = d3.scale.linear()
    .domain([graphData[histoDataLength-1].deaths >= 100 ? graphData[histoDataLength-1].deaths - 100 : 0,  graphData[0].deaths * 1.1])
    .range([0, w]);

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
  .attr("width", 0)  
  .transition()
  .duration(1300)
  .delay(500)
  .attr("width", function(d) {
    return scaling(d.deaths);
    //console.log(d.deaths);
    //return (d.deaths);
  })
  .attr("height", 20)
  .attr("y", function(d, i) {
    return i * 40;
  });


canvas.selectAll("text")
  .data(graphData)
  .enter()
  .append("text")
  .attr("fill", "blue")
  .transition()
  .delay(1500)
  .attr("y", function(d, i) {
    return (i * 40) + 15;
  })
  .attr("x", 5)
  .text(function(d) {
    return d.icd + " Deaths: " + d.deaths;
  });

  canvas.append("g") //append axis 
    .attr("transform", "translate(0,200)")
    .call(axis);



    console.log(document.getElementsByTagName('svg'));
  } else{
    d3.select(".ageHistogram")
    .append("p")
    .text("No results for this demo");

  };  
}    






