
d3.json("./data/testSungraph.json", function (theData) {

 var chartData = theData[0];

  var colors = {
    "Manufactur": "#d30000",
    "Tech": "#ed5b00",
    "Digconn": "#ff8a00",
    "Energy": "#a5be00",
    "Geo": "#007600",
    "Mach Systems": "#00a9e8",
    "Mat": "#006395",
    "Robo": "#8d6fff",
    "Secure": "#77005c",
    "Senrs": "#c56290",
    "Use face": "#a9004f"
  };
  // Dimensions of starburst.
  var width = 800;
  var height = 800;
  var radius = Math.min(width, height) / 4;
  var startYear = 2020;
  var endYear = 2040;
  var baseYear = startYear - 1;
  var yearRing = [{ x: 199, y: 199 }, { x: 162, y: 162 }, { x: 128, y: 128 }, { x: 94, y: 94 }, { x: 60, y: 60 }];
  var maturationYearTextData = [{ dx: -14, dy: -92, label: "2025" }, { dx: -14, dy: -126, label: "2030" }, { dx: -14, dy: -160, label: "2035" }, { dx: -14, dy: -197, label: "2040" }];


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
        return Math.sqrt(d.y) + 50;
      }
    })
    .outerRadius(function (d) {
      if (d.depth == 2) {
        return Math.sqrt(d.y + d.dy);
      } else {
        return Math.sqrt(d.y + d.dy) + 50;
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
      .attr("r", function (d) { return d.x; })
      .style("fill", function (d, i) { return (i == yearRing.length - 1) ? "#fff" : "#f0f0f0"; })
      .style('stroke', '#fff')
      .style("stroke-width", 1.5);

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
      .data([{ cx: 0, cy: -92 }, { cx: 0, cy: -126 }, { cx: 0, cy: -160 }, { cx: 0, cy: -197 }])
      .enter().append("svg:ellipse")
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
      .attr("rx", 24)
      .attr("ry", 13)
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
      .attr("dx", function (d) { return (d.depth == 1) ? 75 : 230; }) // margin
      .attr("dy", ".35em") // vertical-align
      .text(function (d) { return d.depth == 2 ? "-" + d.name.toUpperCase() : ""; })
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    var categoryText = vis.selectAll("categoryText")
      .data(nodes)
      .enter().append("text")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .attr("dy", function (d) { return "11" }) //Move the text down
      .append("textPath")
      .attr("xlink:href", function (d, i) { return "#" + d.name; })
      .attr("startOffset", function (d) {
        return "05%";
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
      .attr("id", function (d) { return "techcircle" + d.name; })
      .attr("cx", function (d) { return getTechCircleData(d, 0); })
      .attr("cy", function (d) { return getTechCircleData(d, 1); })
      .attr("r", 3.5)
      .style("fill", function (d) {
        return d.depth < 1 ? "#C0C0C0" : colors[d.parent.name];
      });

    var techCircleText = vis.selectAll("techCircleText")
      .data(technologies)
      .enter().append("svg:text")
      .attr("id", function (d) { return "techCircleText" + d.name; })
      .text(function (d) { return getTechnologyIndex(d); })
      .style("font-size", "6px")
      .attr("y", "2")
      .style("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dx", function (d) { return getTechCircleData(d, 0); })
      .attr("dy", function (d) { return getTechCircleData(d, 1); })


    var techInvisiblecircle = vis.selectAll("techInvisibleCircle")
      .data(technologies)
      .enter().append("svg:circle")
      .attr("id", function (d) { return "techInvisibleCircle" + d.name; })
      .attr("cx", function (d) { return getTechCircleData(d, 0); })
      .attr("cy", function (d) { return getTechCircleData(d, 1); })
      .attr("r", 3.5)
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
      .attr("x", "2")
      .attr("y", "3")
      .attr("dx", function (d) { return d.dx; })
      .attr("dy", function (d) { return d.dy; });
  };



  // Fade all but the current sequence.
  function mouseover(d) {
    d3.select(this).style("cursor", "pointer");
    d3.select("#technology")
      .text(d.name.toUpperCase());
    d3.select("#maturationText")
      .text(d.maturation);
    d3.select("#associationText")
      .text(d.association);
    d3.select("#explanation")
      .style("visibility", "");
  }


  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {
    d3.select(this).style("cursor", "default");
    // Deactivate all segments during transition.
    d3.selectAll('[id^="techInvisibleCircle"]').on("mouseover", null);
    d3.selectAll('[id^="technologyText"]').on("mouseover", null);
    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll('[id^="techInvisibleCircle"]').transition()
      .duration(10)
      .each("end", function () {
        d3.select(this).on("mouseover", mouseover);
      });
    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll('[id^="technologyText"]').transition()
      .duration(10)
      .each("end", function () {
        d3.select(this).on("mouseover", mouseover);
      });
    d3.select("#explanation")
      .style("visibility", "hidden");
  }
  //calculate rotation angle of text
  function computeTextRotation(d) {
    return (d.x + (d.dx) / 2) * 180 / Math.PI - 90;
  }

  //calculate the position of bubble
  function getTechCircleData(d, i) {
    if (d.maturation <= startYear) {
      return arc.centroid(d)[i] * (0.25 + 0.0332 * 1);
    }
    else if (d.maturation > endYear) {
      return arc.centroid(d)[i] * 1.080;
    }
    else {
      return arc.centroid(d)[i] * (0.25 + 0.0332 * (d.maturation - baseYear));
    }
  }

  function getTechnologyIndex(d) {
    if (d.depth == 2) {
      return d.parent.children.map(function (e) { return e.name; }).indexOf(d.name) + 1;
    }
  }

});
