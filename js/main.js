//Loading movie data and creating the sunburst graph
d3.json('./data/processedData.json', function(data){

  var bechdelViz;

  //Visualize circle graph
  bechdelViz = new circleGraph(data);

  //Set default state, highlight pass and fail
  var allButtons =  document.getElementsByTagName("input");
  allButtons[0].click()
  allButtons[1].click()

});