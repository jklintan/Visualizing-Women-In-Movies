
d3.json("./data/processedData.json", function (theData) {
  
 var chartData = theData;

  var colors = {
    "Comedy": "#d30000",
    "Romance": "#ed5b00",
    "Horror": "#ff8a00",
    "Action": "#a5be00",
    "Adventure": "#007600",
    "Sci-fi": "#00a9e8",
    "Drama": "#006395",
    "Thriller": "#8d6fff",
    "Fantasy": "#77005c",
    "Animation": "#c56290",
  };

  // Dimensions of starburst.
  var width =  1200;
  var height = 800;
  var radius = Math.min(width, height) / 2.67;
  var startYear = 1960;
  var endYear = 2030;
  var baseYear = startYear - 1;
  var yearRing = [{ x: 298, y: 298 }, { x: 264, y: 264 }, { x: 230, y: 230 }, { x: 196, y: 196 }, { x: 162, y: 162 }, { x: 128, y: 128 }, { x: 94, y: 94 }, { x: 60, y: 60 }];
  var maturationYearTextData = [{ dx: -14, dy: -94, label: "1970" }, { dx: -14, dy: -128, label: "1980" }, { dx: -14, dy: -162, label: "1990" }, { dx: -14, dy: -196, label: "2000" }, { dx: -14, dy: -230, label: "2010" }, { dx: -14, dy: -264, label: "2020" }];
  var legend = document.getElementById("legend");

  var vis = d3.select("#vis").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function (d) { return 1; });

  var arc = d3.svg.arc()
    .startAngle(function (d) { return d.x; })
    .endAngle(function (d) { return d.x + d.dx; })
    .innerRadius(function (d) {
      if (d.depth == 1) {
        return 60;
      } else {
        return Math.sqrt(d.y) + 70;
      }
    })
    .outerRadius(function (d) {
      if (d.depth == 2) {
        return Math.sqrt(d.y + d.dy);
      } else {
        return Math.sqrt(d.y + d.dy) + 70;
      }
    });

  //start rendering   
  generateStarBurst(chartData);

  // Main function to draw graph and set up the visualization, once we have the data.
  function generateStarBurst(json) {

    // Bounding circle underneath the starburst, to make it easier to detect
    // when the mouse leaves the parent g.

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
      .filter(function (d) {
        return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

    var technologies = (function (a) {
      var output = [];
      a.forEach(function (d) {
        if (output.indexOf(d.name) === -1) {
          if (d.depth == 2) {
            output.push(d);
          }
        }
      });
      return output;
    })(nodes);

    var circle = vis.selectAll("circle")
      .data(yearRing)
      .enter().append("svg:circle")
      .attr("r", function (d) {
        return d.x; })
      .style("fill", function (d, i) { return (i == yearRing.length - 1) ? "#000" : "#000"; })
      .style('stroke', '#c0c0c0') //Colors of round borders
      .style("stroke-width", 1);

    var path = vis.selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function (d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .attr("id", function (d) { return d.name })
      .style("fill", function (d) { return (d.depth == 2) ? colors[d.parent.name] : "transparent"; })
      .style("opacity", 1)
      .style('stroke', function (d) { return (d.depth == 2) ? colors[d.parent.name] : "#fff"; })
      .style("stroke-width", 1.5);

    var maturationYear = vis.selectAll("ellipse")
      .data([{ cx: 0, cy: -94 }, { cx: 0, cy: -128 }, { cx: 0, cy: -162 }, { cx: 0, cy: -196 }, { cx: 0, cy: -230 }, { cx: 0, cy: -264 }])
      .enter().append("svg:ellipse")
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
      .attr("rx", 20)
      .attr("ry", 12)
      .style("fill", "#fff");


    var technologyText = vis.selectAll("technologyText")
      .data(nodes)
      .enter().append("text")
      .attr("id", function (d) { return "technologyText" + d.name; })
      .attr("transform", function (d) { return "rotate(" + computeTextRotation(d) + ")"; })
      .attr("x", "6")
      .style("font-size", function (d) { return (d.depth == 2) ? "9px" : "10px"; })
      .style("font-weight", "bold")
      .style("fill", function (d) { return (d.depth == 2) ? colors[d.parent.name] : ""; })
      .attr("dx", function (d) { return (d.depth == 1) ? 75 : 300; }) // margin
      .attr("dy", ".35em") // vertical-align
      .text(function (d) { return d.depth == 2 ? "-" : "";}) // + d.Title.toUpperCase() : ""; })
      // .on("mouseover", mouseover)
      // .on("mouseleave", mouseleave);

    var categoryText = vis.selectAll("categoryText")
      .data(nodes)
      .enter().append("text")
      .style("fill", "#fff")
      .style("font-size", "8px")
      .style("width", "10px")
      .style("height", "10px")
      .attr("dy", function (d) { return "-30" }) //Move the text down
      .append("textPath")
      .attr("xlink:href", function (d, i) { return "#" + d.name; })
      .attr("startOffset", function (d) {
        return "02%";
      })
      .text(function (d) {
        var name;
        if (d.depth == 1) {
          name = d.name;
        } else {
          name = "";
        }
        return name.toUpperCase();
      });

      var techCircle = vis.selectAll("techCircle")
      .data(technologies)
      .enter().append("svg:circle")
      .attr("opacity", 0.7)

      .attr("id", function (d) {
        return "techcircle" + d.Title; })
      .attr("class", function (d) { 
          return d.Title; })
      .attr("class", function (d) { 
          return toString(d.Genre); })
      .attr("class", function (d) { 
          return d.bechdel; })
      .attr("cx", function (d) { return getTechCircleData(d, 0); })
      .attr("cy", function (d) { return getTechCircleData(d, 1); })
      .attr("r", function(d){ //Radius of circles
         if(d.income > 200918508){
           return 10;
         }else if(d.income == "-1"){
           return 3;
         }
         return 6;
      })
      //3.5)
      .style("fill", function (d) {
        var thecolor = "#fff";
        if(d.bechdel == 1){
          // thecolor = "#0f0";
          theColor = "#fff"
        }
        if(d.bechdel == 0){
          // thecolor = "red"
          theColor = "#fff"
        }
        return d.depth < 1 ? "#fff" : thecolor; //colors[d.parent.name];
      });

    var techCircleText = vis.selectAll("techCircleText")
      .data(technologies)
      .enter().append("svg:text")
      .attr("id", function (d) { return "techCircleText" + d.name; })
      .style("font-size", "6px")
      .attr("y", "2")
      .style("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dx", function (d) { return getTechCircleData(d, 0); })
      .attr("dy", function (d) { return getTechCircleData(d, 1); })

    var techInvisiblecircle = vis.selectAll("techInvisibleCircle")
      .data(technologies)
      .enter().append("svg:circle")
      .attr("opacity", 0.7)
      .attr("border", "none")
      .attr("class", function (d) { 
        return d.Genre; })
      .attr("class", function (d) { 
        return d.bechdel; })
      .attr("id", function (d) { return "techInvisibleCircle" + d.name; })
      .attr("cx", function (d) { return getTechCircleData(d, 0); })
      .attr("cy", function (d) { return getTechCircleData(d, 1); })
      .attr("r", function(d){ //Radius of circles
        if(d.income > 200918508){
          return 10;
        }else if(d.income == "-1"){
          return 3;
        }
        return 6;
     })
      .style("fill", "transparent")
      .style("strok", "#fff")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);


    var maturationYearText = vis.selectAll("maturationYearText")
      .data(maturationYearTextData)
      .enter().append("text")
      .text(function (d) { return d.label; })
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("x", "1")
      .attr("y", "3")
      .attr("dx", function (d) { return d.dx; })
      .attr("dy", function (d) { return d.dy; });
  };

  var x = document.getElementById("centerImage");

  function mouseover(d) {
    d3.select(this).style("cursor", "pointer");

  
    //Change hover over current circle
   var currentCircle = document.getElementsByTagName("circle");
   for(var i = 0; i < currentCircle.length; i++){
     if(currentCircle[i].id == "techcircle" + d.Title){
       var saveIt = currentCircle[i];
       break;
     }
   }
   saveIt.style.opacity = "1.0"



    var elem = document.getElementById('centerImage')
    elem.style.backgroundImage = "url(/data/images/" + d.PosterImage + ")"; //If local version
    //elem.style.backgroundImage = "url(https://github.com/jklintan/Visualizing-Women-In-Movies/blob/master/data/images/" + d.PosterImage + ")"; //If online version
    elem.style.width = "150px";
    elem.style.height = "150px";
    elem.style.borderRadius = "50%";
    elem.style.color = "black";

    legend.style.visibility = "visible";
    var textTitle = d.Title.toUpperCase();
    var titlen = document.getElementsByTagName("h1");
    var legendTitle = document.getElementById("legendHead");

    if(titlen.length == 0){
      var titlen = document.createElement("h1");
      titlen.append(textTitle);
      legendTitle.append(titlen);     
    }else{
      titlen[0].append(textTitle);
    }

    var bechdelInfo = document.getElementsByClassName("bechdelInfo")
    if(d.bechdel == "1"){
      bechdelInfo[0].append("Passes bechdel test");    
    }else if(d.bechdel == "0"){
      bechdelInfo[0].append("Do not pass the bechdel test");   
    }else{
      bechdelInfo[0].append("Bechdel data do not exist");   
    }



    var coordinates= d3.mouse(this);
    var posMargin = (width/2 + Math.floor(coordinates[0])) + 10;
    var posMargin2 = (height/2 + Math.floor(coordinates[1])) + 10;
    //legend.style.margin =  posMargin2 + "px " + posMargin + "px " ;
    // legend.translate.x = posMargin;
    legend.style.marginTop = posMargin2 + "px";
    legend.style.marginLeft = posMargin + "px";
    //legend.style.margin = posMargin + "px";
  }




  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {
    d3.select(this).style("cursor", "default");
    var legenden = document.getElementById("legend");
    legenden.getElementsByTagName('h1')[0].innerHTML = "";
    legenden.style.marginTop =  "0";
    legenden.style.marginLeft = "0";
    legenden.style.visibility = "hidden";

    var bechdelInfo = document.getElementsByClassName("bechdelInfo")
    bechdelInfo[0].innerHTML = "";    


    var elem = document.getElementById('centerImage');
    elem.style.backgroundImage = "none";


    var currentCircle = document.getElementsByTagName("circle");
    for(var i = 0; i < currentCircle.length; i++){
      if(currentCircle[i].id == "techcircle" + d.Title){
        var saveIt = currentCircle[i];
        break;
      }
    }
 
    saveIt.style.opacity = "0.7";
    
  }
  //calculate rotation angle of text
  function computeTextRotation(d) {
    return (d.x + (d.dx) / 2) * 180 / Math.PI - 90;
  }

  //calculate the position of bubble
  function getTechCircleData(d, i) {
    if (d.Year <= startYear) {
      return arc.centroid(d)[i] * 1.0;
    }
    else if (d.Year > endYear) {
      return arc.centroid(d)[i] * 1.080;
    }
    else {
      return arc.centroid(d)[i] * (0.138 + 0.0118 * (d.Year - baseYear + 1)); //Year
    }
  }

});

