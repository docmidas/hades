//Possible arc radar graph, based on pie graph
////START of GenRadar
//////////////////

function GenRadar(rawData, histoData) {
  console.log("Inside GenRadar");
  console.log("This is rawData length " + rawData.length)
  

  var radarData = [];
  var icdArray = [];
  /////format data sets for men vs women for top causes
  rawData.forEach(function(obj, index){
    if(obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()){
      radarData.push(obj);
      //console.log(obj);
    };
  });

  // rad.forEach(function(obj, index){
  //   if(obj.gender == $('select[name="gender"]').val() && obj.age_group == $('select[name="age_group"]').val()){
  //     radarData.push(obj);
  //     //console.log(obj);
  //   };
  // });

  //////TEST radarData
   //radarData = [300, 60, 156, 175, 80];

  ////check for data, then graph it
  if (radarData.length > 0) { 

    console.log("This is the filtered radarData, below...")
    console.log(radarData);


    radarData.sort(function(a, b) { 
      return b.deaths - a.deaths;
    });

     var radius = 199;

    radarDataLength = radarData.length >= 5 ? 5 : radarData.length;

    radarData = radarData.slice(0, radarDataLength);

        
    var color = d3.scale.ordinal()
      .range(["red", "purple", "orange", "blue", "yellow"]);
   
    console.log("Inside GenRadar, radarData below ");
    console.log(radarData);

    var graphData = radarData,
        w = 500
        h = 250; 

    var scaling = d3.scale.linear()
    .domain([graphData[graphData.length-1].deaths,  graphData[0].deaths])
    .range([0, radius]);    


    var canvas = d3.select(".radar")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(150, 150)");

    var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(function(d, i) {
        return scaling(d.data.deaths);
      });  
   

    var pie = d3.layout.pie()
      .value(function(d) {return d.deaths});
      //.value(function(d) {return d});

    var path = canvas.selectAll('path')
      .data(pie(graphData))
      .enter()
      .append('path')
      .attr('d', arc -arc)
      .style("opacity", 0)
  .transition()
  .delay(1100)
  .duration(1500)
      .style("opacity", 1)
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.deaths);
      });


   



      

  
    } /////end of if true case for results exist
  else{
      d3.select(".radar")
      .append("p")
      .text("No results for this demo");

  };  
} 