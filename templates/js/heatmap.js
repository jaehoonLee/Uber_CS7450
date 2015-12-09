/**
 * Created by jaehoonlee88 on 15. 11. 23..
 */
var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 1000 - 35,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    //colors = ["#AED7E5","#519FCD","#2C8BC4","#3172DA","#0F5DD8","#097CC0","#0745A8","#063682","#044871"], // alternatively colorbrewer.YlGnBu[9]
    colors = ["#C5EBFC","#62B6F6","#519FCD","#2C8BC4","#097CC0","#0745A8","#063682","#044871", "#000F17"],
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
datasets = ["data.tsv", "data2.tsv"];

var svg_1 = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_2 = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels_1 = svg_1.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var dayLabels_2 = svg_2.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels_1 = svg_1.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var timeLabels_2 = svg_2.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


function updateHeatmap(data)
{

        data.forEach(function(d) {

            var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
            d.key = parseDate(d.timestamp);

            if(d.key.getDay() == 0){
                d.day = 7;
            }
            else
                d.day = d.key.getDay();
            d.hour = d.key.getHours() + 1;
            //console.log(d.key);
            //d.value = +d.estimated_waiting_time;


            d.value = +d.surge_multiplier;
        });


        //make new data
        var newdata = [];
        for(var i = 1; i<=7 ; i++){
            var str = '';
            for(var j = 1; j<=24 ; j++) {

                var days = data.filter(function(el){
                    return el.day === i && el.hour === j;
                });
                var val = 0;
                days.forEach(function(d){
                    val += d.value;
                })
                val = val/days.length;

                var dat = {};
                dat.day = i;
                dat.hour = j;
                dat.value = val;

                newdata.push(dat);
                str += val + " ";
            }
            console.log(str);
        }
        //console.log(newdata);
        //data = JSON.parse(newdata);
        data = newdata;


        var legend_height_offset = 12;
        //==================  SVG1  ====================
        var colorScale1 = d3.scale.quantile()
            .domain([1.0, 1.4])
            .range(colors);


        var cards1 = svg_1.selectAll(".hour")
            .data(data, function(d) {return d.day+':'+d.hour;});


        cards1.append("title");

        cards1.enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize; })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        cards1.transition().duration(1000)
            .style("fill", function(d) { return colorScale1(d.value); });

        cards1.select("title").text(function(d) { return d.value; });

        cards1.exit().remove();

        var legend1 = svg_1.selectAll(".legend")
            .data([0].concat(colorScale1.quantiles()), function(d) {

                return d; });

        legend1.enter().append("g")
            .attr("class", "legend");

        legend1.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + legend_height_offset)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

        legend1.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + d.toFixed(2); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize + legend_height_offset);

        legend1.exit().remove();


        //==================  SVG2  ====================

        var colorScale2 = d3.scale.quantile()
            .domain([1.0, 1.4])
            .range(colors);

        var cards2 = svg_2.selectAll(".hour")
            .data(data, function(d) {return d.day+':'+d.hour;});


        cards2.append("title");

        cards2.enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize; })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .on("mouseout", function() {
                /*
            	d3.selectAll(".datamaps-bubble").remove();
                var default_radius=20;
                draw_map([default_radius,default_radius,default_radius,default_radius,default_radius,default_radius,default_radius,default_radius]);
                */
            })
            .on("mouseover", function(d){
                console.log(d);

                var sta_date = new Date("Oct 25, 2015 00:00:00");

                var day_ub = d.day;

                if(day_ub == 0) day_ub=7;

                var offset = 0;
                if(day_ub==7 && d.hour > 1)
                    offset = 1;


                console.log(d.hour);
                sta_date = new Date(sta_date.getTime() + 60000 * 60 * 24 * day_ub);
                var start_time = new Date(sta_date.getTime() + 60000 * 60 * (d.hour-1 + offset));
                var end_time = new Date(sta_date.getTime() + 60000 * 60 * (d.hour + offset));


                start = start_time.getFullYear() + "-" + (start_time.getMonth()+1) + "-" + start_time.getDate() + " " + start_time.getHours() + ":00:00"
                end = end_time.getFullYear() + "-" + (end_time.getMonth()+1) + "-" + end_time.getDate() + " " + end_time.getHours() + ":00:00"
                console.log(start + "," + end);

                $.post("/request_start_pos_data/",
                    {
                        car_type: global_type,
                        start_time: start,
                        end_time: end

                    },
                    function(data, status){

                        var newData = {'0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0}
                        var count = {'0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0}
                        data.forEach(function(d) {
                            d.surge_multiplier = +d.surge_multiplier
                            newData[d.start_pos] = newData[d.start_pos] + d.surge_multiplier;
                            count[d.start_pos] = count[d.start_pos] + 1;


                        });

                        for(var i = 0; i < 8; i++){
                            newData[i] = newData[i]/count[i] * 20;
                        }
                        //console.log(newData);
                        var radius = []
                        for (var key in newData) {

                            radius.push(newData[key]);

                        }

                        //console.log(radius);
                        /*
                        setTimeout(function(){
                            //console.log(radius);

                        }, 300);
                        */

                        d3.selectAll(".datamaps-bubble").remove();
                        console.log(radius);
                        draw_map(radius);

                    });


        });

        cards2.transition().duration(1000)
            .style("fill", function(d) { return colorScale2(d.value); });

        cards2.select("title").text(function(d) { return d.value; });

        cards2.exit().remove();

        var legend2 = svg_2.selectAll(".legend")
            .data([0].concat(colorScale2.quantiles()), function(d) {

                console.log(d);
                return d; });

        legend2.enter().append("g")
            .attr("class", "legend");

        legend2.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + legend_height_offset)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

        legend2.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + d.toFixed(2); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize + legend_height_offset);

        legend2.exit().remove();
}