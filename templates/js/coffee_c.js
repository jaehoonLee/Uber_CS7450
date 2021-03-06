//var xoption = getXSelectedOption()
//var yoption = getYSelectedOption()
// Gets called when the page is loaded.
var svg_coffee, parseDate, xAxis, yAxis, valueline, valueline2, x, y, margin_cof, width_cof, height_cof, formatDate, movingWindowAvg, bisectDate, formatValue;
var timestamp = [];
var wait = [];
var surge = [];


function init(){
    /*Data */

    margin_cof = {top: 30, right: 20, bottom: 30, left: 35},
    width_cof = 1000 - margin_cof.left - margin_cof.right,
    height_cof = 450 - margin_cof.top - margin_cof.bottom;

    parseDate = d3.time.format("%Y-%m-%d %H:%M").parse,
    bisectDate = d3.bisector(function(d) {
		return d.date; }).left,
    formatValue = d3.format(",.1f"),
    formatCurrency = function(d) { return "x" + formatValue(d); };

    formatDate = d3.time.format("%H:%M")

    movingWindowAvg = function (arr, step) {// Window size = 2 * step + 1
	return arr.map(function (_, idx) {
            var wnd = arr.slice(idx - step, idx + step + 1);
            var result = d3.sum(wnd) / wnd.length;

            // Check for isNaN, the javascript way
            result = (result == result) ? result : _;

            return result;
	});
    };
}


function updateClicked(data){


	//d3.select("#vis").html("")
	//d3.select("svg").remove();
	//d3.selectAll("*").remove();
    d3.select("#vis").html("");
	timestamp=[];
	wait = [];
	surge = [];


    // Get the data
    //data = jQuery.parseJSON(data);
	data.forEach(function(d) {
	    d.key = parseDate(d.timestamp);
	    d.wait = +d.estimated_waiting_time / 60.0;
	    d.surge = +d.surge_multiplier;

	    wait.push(+d.estimated_waiting_time / 60.0);
	    surge.push(+d.surge_multiplier);
		timestamp.push(parseDate(d.timestamp));
	});
	// Moving average of surge estimated waiting time
	wait = movingWindowAvg(wait, 7);
	//surge = movingWindowAvg(surge, 2);

	// Scale the range of the data
	var xscale = d3.time.scale().domain(d3.extent(timestamp, function(d) {return d; })).range([0,width_cof]);
	var yscale0 = d3.scale.linear().domain([d3.min(wait), d3.max(wait)]).range([height_cof, 0]);
	var yscale1 = d3.scale.linear().domain([d3.min(surge), d3.max(surge)]).range([height_cof, 0]);


	//Adding trendlines
	valueline = d3.svg.line()
	    .interpolate("basis")
	    .x(function (d, i) {
                return xscale(timestamp[i]);
            })
            .y(function (d) {
                return yscale0(d);
            });

	valueline2 = d3.svg.line()
    	    //.interpolate("basis")
	    	.x(function (d, i) {
                return xscale(timestamp[i]);
            })
            .y(function (d) {
                return yscale1(d);
            });

	var zoom = d3.behavior.zoom()
            .x(xscale)
            .y(yscale0)
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

	var zoomRight = d3.behavior.zoom()
            .x(xscale)
            .y(yscale1)
            .scaleExtent([1, 10]);

	var svg_coffee = d3.select("#vis")
	    .append("svg:svg")
	    .call(zoom)
		.attr("width", width_cof + margin_cof.left + margin_cof.right)
        .attr("height", height_cof + margin_cof.top + margin_cof.bottom)
	    .append("svg:g")
        .attr("transform", "translate(" + margin_cof.left + "," + margin_cof.top + ")");

	//var xAxis = d3.svg_coffee.axis().scale(xscale).tickSize(-height_cof).tickSubdivide(false);
	xAxis = d3.svg.axis().scale(xscale);

	var yAxisLeft = d3.svg.axis().scale(yscale0)
	    .orient("left").ticks(8);

	var yAxisRight = d3.svg.axis().scale(yscale1)
		.orient("left").ticks(5);


	var focus = svg_coffee.append("g")
				.style("display", "none");


	svg_coffee.append("svg:g")         // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height_cof + ")")
            .call(xAxis);

	svg_coffee.append("svg:g")         // Add the Y Axis
            .attr("class", "y axis axisLeft")
	    	.style("fill", "steelblue")
            .call(yAxisLeft);

	svg_coffee.append("svg:g")
	    	.attr("class", "y axis axisRight")
	    	.attr("transform", "translate(" + width_cof + " ,0)")
            .style("fill", "red")
            .call(yAxisRight);

	svg_coffee.append("svg:path")      // Add the valueline path.
            .attr("d", valueline(wait)).attr("class", "y0")
	    	.attr("id", "line1")
	    	.style("stroke","steelblue")
	    	.style("stroke-opacity","0.3")


	svg_coffee.append("svg:path")      // Add the valueline2 path.
	    	.style("stroke", "red")
            .attr("d", valueline2(surge)).attr("class", "y1");



	/*
	  Adding scatter dots
	svg_coffee.selectAll("scatter-dots")
	    .data(wait)
	    .enter().append("svg_coffee:circle")
	    .attr("cy", function (d) { return yscale0(d); } ) // translate y value to a pixel
	    .attr("cx", function (d,i) { return xscale(timestamp[i]); } ) // translate x value
	    .attr("r", 10) // radius of circle
	    .style("opacity", 0.6); // opacity of circle
	*/

	// Remove the line
	// d3.select("#line1").remove()

	/*
	var point = svg_coffee.append("svg_coffee:g")
	    .attr("class", "line-point");

	point.selectAll('circle')
	    .data(function(d){ return d.values})
	    .enter().append('circle')
	    .attr("cx", valueline(wait))
	    .attr("cy", valueline(wait))
	    .attr("r", 4.5);
	*/

	function zoomed() {
            zoomRight.scale(zoom.scale()).translate(zoom.translate());
            svg_coffee.select(".x.axis").call(xAxis);
            svg_coffee.select(".y.axisLeft").call(yAxisLeft);
            svg_coffee.select(".y.axisRight").call(yAxisRight);
            svg_coffee.select(".x.grid")
		.call(make_x_axis()
		      .tickFormat(""));
            svg_coffee.select(".y.axis")
		.call(make_y_axis()
                      .tickSize(5, 0, 0));
            svg_coffee.selectAll(".y0")
		.attr("d", valueline(wait));
            svg_coffee.selectAll(".y1")
		.attr("d", valueline2(surge));

	}
	var make_x_axis = function () {
            return d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.ticks(5);
	};

	var make_y_axis = function () {
            return d3.svg.axis()
		.scale(yscale0)
		.orient("left")
		.ticks(5);
	};
	/*
	var startEnd = xscale.domain().map(function(d) {
	    return d.getDate();
	}),
	days = d3.range(26, 31);
	console.log(xscale(new Date(days[0], 0)));

	console.log(y0.range());
	linesvg_coffee.append("path")
	    .attr("class", "line")
	    .attr("d", valueline(data));
	svg_coffee.selectAll(".divide").data(days)
	    .enter().append("line")
	    .attr("class", "divide")
	    .style("stroke-dasharray", "1,1")
	    .attr("y1", y0.range()[0])
	    .attr("y2", y0.range()[1])
	    .attr("x1", function(d) { return xscale(new Date(d, 0)); })
	    .attr("x2", function(d) { return xscale(new Date(d, 0)); });
	*/


	// append the x line
	focus.append("line")
            .attr("class", "x")
            .style("stroke", "red")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.8)
            .attr("y1", 0)
            .attr("y2", height_cof);

	// append the y line
	focus.append("line")
            .attr("class", "y")
            .style("stroke", "red")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.8)
            .attr("x1", width_cof)
            .attr("x2", width_cof);

	// append the circle at the intersection
	focus.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "red")
            .attr("r", 4);

	// place the value at the intersection
	focus.append("text")
            .attr("class", "y1")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "-.3em");
	focus.append("text")
            .attr("class", "y2")
            .attr("dx", 8)
            .attr("dy", "-.3em");

	// place the date at the intersection
	focus.append("text")
            .attr("class", "y3")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "1em");
	focus.append("text")
            .attr("class", "y4")
            .attr("dx", 8)
            .attr("dy", "1em");

	    // append the rectangle to capture mouse
	svg_coffee.append("rect")
            .attr("width", width_cof)
            .attr("height", height_cof)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

	svg_coffee.append("rect")
	    //.attr("class", "overlay")
	    .attr("width", width_cof)
	    .attr("height", height_cof)
	    .style("fill", "none")
	    .style("pointer-events", "all")
	    .on("mouseover", function() { focus.style("display", null); })
	    .on("mouseout", function() { focus.style("display", "none"); })
	    .on("mousemove", mousemove);

	function mousemove() {

		var x0 = xscale.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;

		//console.log(x0);
		console.log(x0 - d0.date);
		console.log(d1.date - x0);
		console.log(yscale1(d.surge));


		var y_val_m = yscale1(d.surge);
		console.log(yscale1(d.surge));

		focus.select("circle.y")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")");

		focus.select("text.y1")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")")
			.text(d.surge);

		focus.select("text.y2")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")")
			.text(d.surge);

		focus.select("text.y3")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")")
			.text(formatDate(d.key));

		focus.select("text.y4")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")")
			.text(formatDate(d.key));

		focus.select(".x")
			.attr("transform",
			"translate(" + xscale(d.key) + "," +
			y_val_m + ")")
			.attr("y2", height_cof - yscale1(d.surge));

		focus.select(".y")
			.attr("transform",
			"translate(" + width_cof * -1 + "," +
			y_val_m + ")")
			.attr("x2", width_cof + width_cof);

	}
}



/*
//Called when the update button is clicked


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
	.attr("transform", "translate(0," + height_cof + ")")
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
	.attr("x", width_cof/2)
	.attr("y", height_cof + margin_cof.bottom-3)
	.text(xoption);
    
    // transition the bars to display new data
    var bar = chart.selectAll("rect")
        .data(data)
	.transition()
	.duration(700)
	.attr("x", function(d) { return x(d.key);})
	.attr("width_cof", x.rangeBand())
	.attr("y", function(d) { return y(d.values);})
	.attr("height_cof", function(d) { return height_cof - y(d.values); });

}
*/
// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
/*
function getXSelectedOption(){
    var node = d3.select('#xdropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
    var node = d3.select('#ydropdown').node();
    var i = node.selectedIndex;
    return node[i].value;
}
*/
