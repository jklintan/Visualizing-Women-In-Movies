

d3.json('./data/processedData.json', function(data){
  console.log(data)

  var sunburstGraph;

  //Visualize sunburst
  sunburstGraph = new sunburst(data);

});