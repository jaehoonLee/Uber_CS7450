var xoption = getXSelectedOption()
var yoption = getYSelectedOption()
// Gets called when the page is loaded.
function init(){
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
    
    var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);

    var valueline = d3.svg.line()
	.x(function(d) { return x(d.key); })
	.y(function(d) { return y(d.values); });
    
    var svg = d3.select("#vis")
	.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.json("static/uber.json", function(error, data) {
	data.forEach(function(d) {
            d.key = parseDate(d.timestamp);
	    //console.log(d.key);
            d.values = +d.estimated_waiting_time;
	});
	
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.key; }));
	y.domain([0, d3.max(data, function(d) { return d.values; })]);
	
	svg.append("path")      // Add the valueline path.
            .attr("d", valueline(data));

	svg.append("g")         // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

	svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis);

    });
}
//Called when the update button is clicked
function updateClicked(){
    //d3.csv('data/CoffeeData.csv',update)
}

//Callback for when data is loaded
function update(rawdata){
    // get the updated option to display the corresponding data
    var xoption = getXSelectedOption()
    var yoption = getYSelectedOption()

    //PUT YOUR UPDATE CODE BELOW
    rawdata.forEach(function(d) {
    d.sales = +d.sales
    d.profit = +d.profit
    })
    
    // aggregate data to get summation stats
    var data = d3.nest()
	.key(function(d) { return d[xoption];})
	.rollup(function(d) {
	    return d3.sum(d, function(g) {return g[yoption]; });
	}).entries(rawdata);
    console.log(data)

    // set domains and x and y axes
    x.domain(data.map(function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) {return d.values; })]);
    
    // remove existing x and y labels and append new ones
    chart.select("g.y.axis").remove();
    chart.select("g.x.axis").remove();
    chart.select("text.x.label").remove();
    chart.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", "-.55em")
	.attr("transform", "rotate(-90)" );
    
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
	.append("text")
	.text("Value ($)");

    chart.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "end")
	.attr("x", width/2)
	.attr("y", height + margin.bottom-3)
	.text(xoption);
    
    // transition the bars to display new data
    var bar = chart.selectAll("rect")
        .data(data)
	.transition()
	.duration(700)
	.attr("x", function(d) { return x(d.key);})
	.attr("width", x.rangeBand())
	.attr("y", function(d) { return y(d.values);})
	.attr("height", function(d) { return height - y(d.values); });

}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
    /*
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
  */
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
    /*
  var node = d3.select('#ydropdown').node();
  //var i = node.selectedIndex;
  return node[i].value;
  */
}

