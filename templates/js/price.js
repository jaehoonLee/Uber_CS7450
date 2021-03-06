//Get the Amount of alerts for tooltip uber focus_price
var bisectDate = d3.bisector(function(d) {
    return d.date;
}).left;
//must be global
var focus_price;
var yhigh_price;
function addAxesAndLegend_price (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 220,
      legendHeight = 60;

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Est. Price ($)');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');
  
  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .style('fill', 'transparent')
    .attr('height', legendHeight);

    legend.append('rect')
	.attr('class', 'outer')
	.style('fill', 'C5EBFC')
	.attr('width',  75)
	.attr('height', 20)
	.attr('x', 10)
	.attr('y', 10);

    legend.append('text')
	.attr('x', 115)
	.attr('y', 25)
	.text('Price range');

    legend.append('rect')
	.attr('class', 'inner')
	.style('fill', 'steelblue')
	.attr('width',  75)
	.attr('height', 2)
	.attr('x', 10)
	.attr('y', 40);
    
    legend.append('text')
	.attr('x', 115)
	.attr('y', 50)
	.text('Average Price');

}

function drawPaths_price (svg, x, yhigh_price, chartHeight, estHigh, estLow, date, avg) {

    var upperInnerArea = d3.svg.area()
	.interpolate('basis')
	.x (function (d, i) { return x(date[i]) })
	.y0(function (d) { return chartHeight; })
	.y1(function (d) { return yhigh_price(d); });
    
    var lowerInnerArea = d3.svg.area()
	.interpolate('basis')
    	.x (function (d, i) { return x(date[i]) })
	.y0(function (d) { return chartHeight; })
	.y1(function (d) { return yhigh_price(d); });

    var valueline = d3.svg.line()
	.interpolate("basis")
	.x (function (d, i) { return x(date[i]) })
	.y (function (d) { return yhigh_price(d); })
    
    svg.append('path')
	.style('fill', 'C5EBFC')
	.style('stroke-width', 0)
	.attr('class', 'area')
	.attr('d', upperInnerArea(estHigh))

    svg.append('path')
	.style('fill', 'white')
	.style('stroke-width', 0)
	.attr('class', 'area')
	.attr('d', lowerInnerArea(estLow))


    svg.append("path")      
        .attr("class", "line")
        .attr("d", valueline(estHigh))
	.style('stroke', '389DBE')
	.style('stroke-width', 1);
	
    svg.append("path")      
        .attr("class", "line")
        .attr("d", valueline(estLow))
	.style('stroke', '389DBE')
	.style('stroke-width', 1);
    
    svg.append("path")      
        .attr("class", "line")
        .attr("d", valueline(avg))
	.style('stroke', 'steelblue')
	.style('stroke-width', 2);
}

function makeChart_price (estHigh, estLow, date, avg, data) {
    var svgWidth  = 960,
    svgHeight = 500,
    margin = { top: 20, right: 20, bottom: 40, left: 40 },
    chartWidth  = svgWidth  - margin.left - margin.right,
    chartHeight = svgHeight - margin.top  - margin.bottom;
    var x = d3.time.scale().range([0, chartWidth])
        .domain(d3.extent(date, function (d) { return d; }));
    yhigh_price = d3.scale.linear().domain([d3.min(estLow), d3.max(estHigh)]).range([chartHeight, 0]);
    
    var xAxis = d3.svg.axis().scale(x).orient('bottom')
    yAxis = d3.svg.axis().scale(yhigh_price).orient('left')
    
    var svg = d3.select('#price').append('svg')
	.attr('width',  svgWidth)
	.attr('height', svgHeight)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    

    drawPaths_price(svg, x, yhigh_price, chartHeight, estHigh, estLow, date, avg);
    addAxesAndLegend_price(svg, xAxis, yAxis, margin, chartWidth, chartHeight);

    // Tooltip
    focus_price = svg.append("g")
        .attr("class", "focus_price")
        .style("display", "none");

    focus_price.append("circle")
        .attr("r", 4.5);

    focus_price.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    // append the rectangle to capture mouse
    svg.append("rect")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { 
                focus_price.style("display", null);
                focus_time.style("display", null);
            })
            .on("mouseout", function() { 
                focus_price.style("display", "none"); 
                focus_time.style("display", "none"); 
            })
            .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus_time.attr("transform", "translate(" + x(d.date) + "," + yhigh_time(d.totaltime) + ")");
        focus_price.attr("transform", "translate(" + x(d.date) + "," + yhigh_price(d.avg) + ")");


        //focus_price.select("text").text(Math.floor(d.estHigh) + '   ' + tooltipDate(d.date));
        //for bar chart selection
        var hour = x.invert(d3.mouse(this)[0]).getHours();
        var currentDay = x.invert(d3.mouse(this)[0]).getDay();

        var weekday = new Array(7);
        weekday[0]=  "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        console.log(currentDay);
        //fake value, assume to be monday
        var barChartDay = 1;
        console.log(hour);
        focus_time.select('text').text('(' + weekday[currentDay] + ' '+ addZero(hour) + ':00,   ' + d.totaltime.toFixed(2) + 'min)');
        focus_price.select("text").text('(' + weekday[currentDay] + ' '+ addZero(hour) + ':00,   $' + d.avg.toFixed(2) + ')'); //Math.floor(d.estHigh) + '   ' + tooltipDate(d.date)


       //for bar chart selection
        var hour = x.invert(d3.mouse(this)[0]).getHours();
        bar_currDay = x.invert(d3.mouse(this)[0]).getDay();
        if (bar_currDay != bar_prevDay) {
            document.getElementById("myDay").innerHTML = weekday_g[bar_currDay];
            switchDay(bar_currDay);
            bar_prevDay = bar_currDay
        }

        console.log(bar_currDay);
        //fake value, assume to be monday

        console.log(hour);
        if (bar_currDay == bar_prevDay) {
            d3.selectAll(".hours.hour"+hour)
            .style("font-size", "18px").transition().style("font-size", "12px");
            d3.selectAll(".barText.hour" + hour)
            .style("font-size", "18px").transition().style("font-size", "12px");
        }
    }    
}

function init_price(){
    var movingWindowAvg = function (arr, step) {// Window size = 2 * step + 1
	return arr.map(function (_, idx) { 
            var wnd = arr.slice(idx - step, idx + step + 1); 
            var result = d3.sum(wnd) / wnd.length;
	    
            // Check for isNaN, the javascript way
            result = (result == result) ? result : _;
	    
            return result; 
	});
    };
    var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
    var estHigh = [];
    var estLow = [];
    var date = [];
    var avg = [];
    var tempArr = [];
    //FIXME
    d3.json('uber.json', function (error, rawData) {
        if (error) {
            console.error(error);
            return;
        }
        rawData.forEach(function(d) {
            d.date = parseDate(d.timestamp);

            date.push(parseDate(d.timestamp));
            estHigh.push(+d.high_estimate_price);
            estLow.push(+d.low_estimate_price);
            avg.push((+d.high_estimate_price+d.low_estimate_price)/2);
        
        //total time
        tempArr.push((+d.duration+d.estimated_waiting_time) / 60.0);

        });
        estHigh = movingWindowAvg(estHigh, 7);
        estLow = movingWindowAvg(estLow, 7);
        avg = movingWindowAvg(avg, 7);
        //reassign the focus_price point value
        rawData.forEach(function(d, i) {
            d.avg = avg[i];
            d.totaltime = tempArr[i];
        });
        makeChart_price(estHigh, estLow, date, avg, rawData);
    });
}
//TODO
function update_price(rawData){
    d3.select("#price").html("");

    var movingWindowAvg = function (arr, step) {// Window size = 2 * step + 1
	return arr.map(function (_, idx) {
            var wnd = arr.slice(idx - step, idx + step + 1);
            var result = d3.sum(wnd) / wnd.length;

            // Check for isNaN, the javascript way
            result = (result == result) ? result : _;

            return result;
	});
    };
    var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
    var estHigh = [];
    var estLow = [];
    var date = [];
    var avg = [];
    var tempArr = [];

    rawData.forEach(function(d) {
        d.date = parseDate(d.timestamp);

        date.push(parseDate(d.timestamp));
        estHigh.push(+d.high_estimate_price);
        estLow.push(+d.low_estimate_price);
        avg.push((+d.high_estimate_price+d.low_estimate_price)/2);

        //total time
        tempArr.push((+d.duration+d.estimated_waiting_time) / 60.0);


    });
    estHigh = movingWindowAvg(estHigh, 7);
    estLow = movingWindowAvg(estLow, 7);
    avg = movingWindowAvg(avg, 7);
    tempArr = movingWindowAvg(tempArr, 7);

    //reassign the focus_price point value
    rawData.forEach(function(d, i) {
        d.avg = avg[i];
        d.totaltime = tempArr[i];
    });
    makeChart_price(estHigh, estLow, date, avg, rawData);
}
