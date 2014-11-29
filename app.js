/**
 *  CS 294: Visualization, Fall 2014
 */

(function() {
    /********** Global Config **********/
    var margin = {
            top: 20,
            right: 0,
            bottom: 40,
            left: 30
    },
    width = 500 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize * 2,
    buckets = 9,
    // Colors from colorbrewer.YlGnBu[9]
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4",
            "#1d91c0", "#225ea8", "#253494", "#081d58"
    ],
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a",
            "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p",
            "6p", "7p", "8p", "9p", "10p", "11p", "12p"
    ];

    /********** Data format **********/
    var dataFormat = function(d) {
            return {
                    day: +d.day,
                    hour: +d.hour,
                    value: +d.value,
                    x: (d.hour - 1) * gridSize,
                    y: (d.day - 1) * gridSize
            };
    }

    /********** Build Bar Chart **********/
    function updateBar(barID, dataset) {
            var w = 500;
            var h = 150;
            var xScale = d3.scale.ordinal()
                    .domain(d3.range(dataset.length))
                    .rangeRoundBands([0, w], 0.05);
            var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d) {
                            return d.value;
                    })])
                    .range([0, h]);
            var key = function(d) {
                    // console.log("" + d.day + d.hour);
                    return "" + d.day + d.hour;
            };
            d3.select("#" + barID).select("svg").remove();
            //Create SVG element
            var svg = d3.select("#" + barID)
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("id", "bar");


            //Create bars
            svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                            return xScale(i);
                    })
                    .attr("y", function(d) {
                            return h - yScale(d.value);
                    })
                    .attr("width", xScale.rangeBand())
                    .attr("height", function(d) {
                            return yScale(d.value);
                    })
                    .attr("fill", function(d) {
                            return "rgb(0, 0, " + (d.value * 10) + ")";
                    })

            //Tooltip
            .on("mouseover", function(d) {
                    //Get this bar's x/y values, then augment for the tooltip
                    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
                    var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

                    //Update Tooltip Position & value
                    d3.select("#tooltip")
                            .style("left", xPosition + "px")
                            .style("top", yPosition + "px")
                            .select("#value")
                            .text(d.value);
                    d3.select("#tooltip").classed("hidden", false)
            })
                    .on("mouseout", function() {
                            //Remove the tooltip
                            d3.select("#tooltip").classed("hidden", true);
                    });

            //Create labels
            svg.selectAll("text")
                    .data(dataset, key)
                    .enter()
                    .append("text")
                    .text(function(d) {
                            return d.value;
                    })
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) {
                            return xScale(i) + xScale.rangeBand() / 2;
                    })
                    .attr("y", function(d) {
                            return h - yScale(d.value) + 14;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "10px")
                    .attr("fill", "white");
    }

    /********** Build Line Chart **********/
    function updateLine(lineID, data) {
            var element = document.getElementById(lineID);

    }

    /********** Build Box Chart **********/
    function updateBox(boxID, data) {
            var element = document.getElementById(boxID);

    }


    /********** View Update **********/
    function updateList(listID, data) {
            var element = document.getElementById(listID);
            var listItem;
            element.innerHTML = "";
            data.forEach(function(d) {
                    listItem = document.createElement('li');
                    listItem.innerHTML = "Day: " + d.day + ",  Hour: " + d.hour + ",  Value: " + d.value;
                    element.appendChild(listItem);
            });
    }

    /********** Search Functions **********/
    // Collapse the quadtree into an array of rectangles.
    function nodes(quadtree) {
            var nodes = [];
            quadtree.visit(function(node, x1, y1, x2, y2) {
                    if (node.point) {
                            nodes.push({
                                    point: node.point,
                                    x: x1,
                                    y: y1,
                                    width: x2 - x1,
                                    height: y2 - y1,
                            });
                    }
            });
            return nodes;
    }

    // Find the nodes within the specified rectangle.
    function search(quadtree, x0, y0, x3, y3) {
            quadtree.visit(function(node, x1, y1, x2, y2) {
                    var p = node.point;
                    if (p) {
                            // p.scanned = true;
                            node.point.selected = (p.x >= x0) && (p.x < x3) && (p.y >= y0) && (p.y < y3);
                    }
                    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
            });
    }

    /********** Graph Annotation **********/
    var graphAnnotate = function(rootSvg, colorScale) {
            // var dayLabels = rootSvg.selectAll(".dayLabel")
            //     .data(days)
            //     .enter().append("text")
            //     .text(function (d) { return d; })
            //     .attr("x", 0)
            //     .attr("y", function (d, i) { return i * gridSize; })
            //     .style("text-anchor", "end")
            //     .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            //     .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            // var timeLabels = rootSvg.selectAll(".timeLabel")
            //     .data(times)
            //     .enter().append("text")
            //     .text(function(d) { return d; })
            //     .attr("x", function(d, i) { return i * gridSize; })
            //     .attr("y", 0)
            //     .style("text-anchor", "middle")
            //     .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            //     .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

            var legend = rootSvg.selectAll(".legend")
                    .data([0].concat(colorScale.quantiles()), function(d) {
                            return d;
                    })
                    .enter().append("g")
                    .attr("class", "legend");

            legend.append("rect")
                    .attr("x", function(d, i) {
                            return legendElementWidth * i;
                    })
                    .attr("y", height - 320)
                    .attr("width", legendElementWidth)
                    .attr("height", gridSize / 2)
                    .style("fill", function(d, i) {
                            return colors[i];
                    });

            legend.append("text")
                    .attr("class", "mono")
                    .text(function(d) {
                            return "≥ " + Math.round(d);
                    })
                    .attr("x", function(d, i) {
                            return legendElementWidth * i;
                    })
                    .attr("y", height - 320 + gridSize);

    }

    /********** Graph callback **********/
    var graphCallbackOne = function(error, data) {
            var colorScale = d3.scale.quantile()
                    .domain([0, buckets - 1, d3.max(data, function(d) {
                            return d.value;
                    })])
                    .range(colors);

            var svg = d3.select("#charta").append("svg")
                    .attr("width", 500)
                    .attr("height", 200)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // quadtree data structure to optimized brush seleciton searching
            var quadtree = d3.geom.quadtree(data, -1, -1, width + 1, height + 1);

            var heatMap = svg.selectAll(".hour")
                    .data(nodes(quadtree))
                    .enter().append("rect")
                    .attr("x", function(d) {
                            return (d.point.hour - 1) * gridSize;
                    })
                    .attr("y", function(d) {
                            return (d.point.day - 1) * gridSize;
                    })
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("class", "hour bordered")
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .style("fill", colors[0]);

            heatMap.transition().duration(1000)
                    .style("fill", function(d) {
                            return colorScale(d.point.value);
                    });

            heatMap.append("title").text(function(d) {
                    return d.point.value;
            });

            graphAnnotate(svg, colorScale);

            // brush selection logic.
            function brushed1() {
                    var selectedNodes = [];
                    var extent = heatmapBrush1.extent();

                    // lock brush to multiples of 20
                    extent[0][0] = Math.round(extent[0][0]/19)*19;
                    extent[0][1] = Math.round(extent[0][1]/19)*19;
                    extent[1][0] = Math.round(extent[1][0]/19)*19;
                    extent[1][1] = Math.round(extent[1][1]/19)*19;

                    heatMap.each(function(d) {
                            d.point.selected = false;
                    });
                    search(quadtree, extent[0][0] - 15, extent[0][1] - 15, extent[1][0], extent[1][1]);
                    heatMap.classed("selected", function(d) {
                            if (d.point.selected) selectedNodes.push(d.point);
                            return d.point.selected;
                    });
                    //updateList('list1', selectedNodes);
                    //console.log(selectedNodes);
                    updateBar('bar1', selectedNodes);
                    if (!d3.event.sourceEvent) return;
                    d3.select(this).transition()
                        .call(heatmapBrush1.extent(extent))
                        .call(heatmapBrush1.event);
                    // synchronize other graph
                    d3.select('.heatmapbrush2').transition()
                            .call(heatmapBrush2.extent(extent))
                            .call(heatmapBrush2.event);
            }

            heatmapBrush1 = d3.svg.brush()
                    .x(d3.scale.identity().domain([0, width]))
                    .y(d3.scale.identity().domain([0, height / 2]))
                    .extent([
                            [0, 0],
                            [17, 132]
                    ])
                    .on("brushend", brushed1);

            svg.append("g")
                    .attr("class", "heatmapbrush1")
                    .call(heatmapBrush1);
    }

    var graphCallbackTwo = function(error, data) {
            var colorScale = d3.scale.quantile()
                    .domain([0, buckets - 1, d3.max(data, function(d) {
                            return d.value;
                    })])
                    .range(colors);

            var svg = d3.select("#chartb").append("svg")
                    .attr("width", 500)
                    .attr("height", 200)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // quadtree data structure to optimized brush seleciton searching
            var quadtree = d3.geom.quadtree(data, -1, -1, width + 1, height + 1);

            var heatMap = svg.selectAll(".hour")
                    .data(nodes(quadtree))
                    .enter().append("rect")
                    .attr("x", function(d) {
                            return (d.point.hour - 1) * gridSize;
                    })
                    .attr("y", function(d) {
                            return (d.point.day - 1) * gridSize;
                    })
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("class", "hour bordered")
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .style("fill", colors[0]);

            heatMap.transition().duration(1000)
                    .style("fill", function(d) {
                            return colorScale(d.point.value);
                    });

            heatMap.append("title").text(function(d) {
                    return d.point.value;
            });

            graphAnnotate(svg, colorScale);

            // brush selection logic.
            function brushed2() {
                    var selectedNodes = [];
                    var extent = heatmapBrush2.extent();

                    // lock brush to multiples of 20
                    extent[0][0] = Math.round(extent[0][0]/19)*19;
                    extent[0][1] = Math.round(extent[0][1]/19)*19;
                    extent[1][0] = Math.round(extent[1][0]/19)*19;
                    extent[1][1] = Math.round(extent[1][1]/19)*19;

                    heatMap.each(function(d) {
                            d.point.selected = false;
                    });
                    search(quadtree, extent[0][0] - 15, extent[0][1] - 15, extent[1][0], extent[1][1]);
                    heatMap.classed("selected", function(d) {
                            if (d.point.selected) selectedNodes.push(d.point);
                            return d.point.selected;
                    });
                    //updateList('list2', selectedNodes);
                    updateBar('bar2', selectedNodes);

                    if (!d3.event.sourceEvent) return;
                    d3.select(this).transition()
                        .call(heatmapBrush2.extent(extent))
                        .call(heatmapBrush2.event);
                    // synchronize other graph
                    d3.select('.heatmapbrush1').transition()
                            .call(heatmapBrush1.extent(extent))
                            .call(heatmapBrush1.event);
            }

            heatmapBrush2 = d3.svg.brush()
                    .x(d3.scale.identity().domain([0, width]))
                    .y(d3.scale.identity().domain([0, height / 2]))
                    .extent([
                            [0, 0],
                            [17, 132]
                    ])
                    .on("brushend", brushed2);

            svg.append("g")
                    .attr("class", "heatmapbrush2")
                    .call(heatmapBrush1);
    }

    /** Heatmap 1 ************************************/
    d3.csv("data.csv", dataFormat, graphCallbackOne);

    /** Heatmap 2 ************************************/
    d3.csv("data2.csv", dataFormat, graphCallbackTwo);

    var width = 500,
        height = 480;
})();
