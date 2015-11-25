var xoption = getXSelectedOption()
var yoption = getYSelectedOption()
// Gets called when the page is loaded.
var svg_coffee, parseDate, xAxis, yAxis, valueline, x, y, margin_cof, width_cof, height_cof;

function init(){

    margin_cof = {top: 30, right: 20, bottom: 30, left: 50},
    width_cof = 600 - margin_cof.left - margin_cof.right,
    height_cof = 270 - margin_cof.top - margin_cof.bottom;

    parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;

    x = d3.time.scale().range([0, width_cof]);
    y = d3.scale.linear().range([height_cof, 0]);

    xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);

    yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);

    valueline = d3.svg.line()
	.x(function(d) { return x(d.key); })
	.y(function(d) { return y(d.values); });

    // Get the data
    $.post("/request_data/",
    {
        start_pos: "0",
        car_type: "0",
        start_time: "2015-10-27",
        end_time: "2015-11-02"
    },
    function(data, status){
        updateClicked(data);

    });

}

//Called when the update button is clicked
function updateClicked(data){
    //d3.csv('data/CoffeeData.csv',update)
    //alert("Data: " + data + "\nStatus: " + status);

    d3.select("#vis").html("")

    svg_coffee = d3.select("#vis")
    .append("svg")
    .attr("width", width_cof + margin_cof.left + margin_cof.right)
    .attr("height", height_cof + margin_cof.top + margin_cof.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_cof.left + "," + margin_cof.top + ")");
    data = jQuery.parseJSON(data);

    data.forEach(function(d) {
        d.key = parseDate(d.timestamp);
        //console.log(d.key);
        d.values = +d.estimated_waiting_time;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.values; })]);

    svg_coffee.append("path")      // Add the valueline path.
        .attr("d", valueline(data));

    svg_coffee.append("g")         // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_cof + ")")
        .call(xAxis);

    svg_coffee.append("g")         // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

    /*
    //for slider part-----------------------------------------------------------------------------------
    var margin = {top: 20, right: 200, bottom: 100, left: 50},
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

    var xScale = d3.time.scale()
    .range([0, width]),

    xScale2 = d3.time.scale()
    .range([0, width]); // Duplicate xScale for brushing ref later

    var yScale = d3.scale.linear()
    .range([height, 0]);



    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
     .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white");

    var context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + 410 + ")")
        .attr("class", "context");

//append clip path for lines plotted, hiding those part out of bounds
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

//end slider part-----------------------------------------------------------------------------------
//for slider part-----------------------------------------------------------------------------------

    var brush = d3.svg.brush()//for slider bar at the bottom
        .x(xScale2)
        .on("brush", brushed);

    context.append("g") // Create brushing xAxis
        .attr("class", "x axis1")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
        .interpolate("monotone")
        .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
        .y0(height2) // Bottom line begins at height2 (area chart not inverted)
        .y1(0); // Top line of area, 0 (area chart not inverted)

    //plot the rect as the bar at the bottom
    context.append("path") // Path is created using svg.area details
        .attr("class", "area")
        .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator
        .attr("fill", "#F1F1F2");

    //append the brush for the selection of subsection
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height2) // Make brush rects same height
        .attr("fill", "#E6E7E8");
    //end slider part-----------------------------------------------------------------------------------

    //for brusher of the slider bar at the bottom
  function brushed() {

    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent

    svg.select(".x.axis") // replot xAxis with transition when brush used
          .transition()
          .call(xAxis);

    maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
    yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

    svg.select(".y.axis") // Redraw yAxis
      .transition()
      .call(yAxis);

    issue.select("path") // Redraw lines based on brush xAxis scale and domain
      .transition()
      .attr("d", function(d){
          return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
      });

  };
    */
}

