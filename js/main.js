//Loading movie data and creating the sunburst graph
d3.json('./data/processedData.json', function(data){

  var sunburstGraph;

  //Visualize sunburst
  sunburstGraph = new sunburst(data);

});