/**
 *  CS 294: Visualization, Fall 2014
 */

 /********** Global Config **********/
var margin = { top: 0, right: 0, bottom: 40, left: 30 },
    width = 500 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    // Colors from colorbrewer.YlGnBu[9]
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4",
              "#1d91c0","#225ea8","#253494","#081d58"], 
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a",
             "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p",
             "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

 /********** Data format **********/
dataFormat = function(d) {
    return {
        day: +d.day,
        hour: +d.hour,
        value: +d.value
    };
}

 /********** Graph Annotation **********/
graphAnnotate = function(rootSvg, colorScale) {
    var dayLabels = rootSvg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

    var timeLabels = rootSvg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

    var legend = rootSvg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; })
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height-320)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
        .attr("class", "mono")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height-320 + gridSize);

}

 /********** Graph callback **********/
graphCallbackOne = function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var svg = d3.select("#chart").append("svg")
        .attr("width", 500 )
        .attr("height", 200 )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var heatMap = svg.selectAll(".hour")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    heatMap.append("title").text(function(d) { return d.value; });

    graphAnnotate(svg, colorScale);

    // brush selection logic.
    function brushed1() {
        if (!d3.event.sourceEvent) return;
        var extent = heatmapBrush1.extent();
        d3.select('.heatmapbrush2').transition()
            .call(heatmapBrush2.extent(extent))
            .call(heatmapBrush2.event);
    }

    heatmapBrush1 = d3.svg.brush()
        .x(d3.scale.identity().domain([0, width]))
        .y(d3.scale.identity().domain([0, height/2]))
        .extent([[100, 100], [200, 200]])
        .on("brushend", brushed1);

    svg.append("g")
        .attr("class", "heatmapbrush1")
        .call(heatmapBrush1);
}

graphCallbackTwo = function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var svg = d3.select("#chart").append("svg")
        .attr("width", 500 )
        .attr("height", 200 )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var heatMap = svg.selectAll(".hour")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    heatMap.append("title").text(function(d) { return d.value; });

    graphAnnotate(svg, colorScale);

    // brush selection logic.
    function brushed2() {
        if (!d3.event.sourceEvent) return;
        var extent = heatmapBrush2.extent();
        d3.select('.heatmapbrush1').transition()
            .call(heatmapBrush1.extent(extent))
            .call(heatmapBrush1.event);
    }

    heatmapBrush2 = d3.svg.brush()
        .x(d3.scale.identity().domain([0, width]))
        .y(d3.scale.identity().domain([0, height/2]))
        .extent([[100, 100], [200, 200]])
        .on("brushend", brushed2);

    svg.append("g")
        .attr("class", "heatmapbrush2")
        .call(heatmapBrush2);
}

 /** Heatmap 1 ************************************/
d3.csv("data.csv", dataFormat, graphCallbackOne);

 /** Heatmap 2 ************************************/
d3.csv("data.csv", dataFormat, graphCallbackTwo);

 /** Untested stuff that's cluttering the global namespace. ************************************/
var width = 500,    height = 480;
