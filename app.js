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
                width = 200 - margin.left - margin.right,
                height = 430 - margin.top - margin.bottom,
                gridSize = 20, //Math.floor(width / 24),
                legendElementWidth = gridSize * 2,
                buckets = 9,
                colors = ['rgb(255,255,204)', 'rgb(255,237,160)', 'rgb(254,217,118)',
                        'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(252,78,42)', 'rgb(227,26,28)',
                        'rgb(189,0,38)', 'rgb(128,0,38)'
                ]
        days = ["7.7m", "", "", "", "", "", "", "", "", "", "", "", "", "", "0 m"],
        times = ["0 m", "", "", "", "", "", "", "4 m"];
        /********** Data format **********/
        var dataFormat = function(d) {
                return {
                        day: +d.day,
                        hour: +d.hour,
                        value: +d.value,
                        sensor: d.Sensor_id,
                        x: d.x,
                        y: d.y
                };
        }

        /********** Build Bar Chart **********/
        function updateBar(barID, dataset) {
                var values = [];
                var sensorMap = [];
                for (var i = 0, len = dataset.length; i < len; i++) {
                        val = dataset[i];
                        sensorMap.push([val.value, val.sensor]);
                        values.push(val.value);
                }
                d3.select("#" + barID).select("svg").remove();

                // A formatter for counts.
                var formatCount = d3.format(",.0f");

                var margin = {
                                top: 10,
                                right: 10,
                                bottom: 30,
                                left: 25 //10
                        },
                        width = 620 - margin.left - margin.right,
                        height = 100 - margin.top - margin.bottom;

                var x = d3.scale.linear()
                        .domain([d3.min(values), d3.max(values)])
                        .range([0, width]);

                // Generate a histogram using twenty uniformly-spaced bins.
                var data = d3.layout.histogram()
                        .bins(x.ticks(40))
                        (values);

                var y = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) {
                                return d.y;
                        })])
                        .range([height, 0]);

                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(4);

                var svg = d3.select("#" + barID).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                barcolors = ['rgb(254,217,118)',
                        'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(252,78,42)', 'rgb(227,26,28)',
                        'rgb(189,0,38)', 'rgb(128,0,38)'
                ]

                var barcolorScale = d3.scale.quantile()
                        .domain([100, 960])
                        .range(barcolors);

                var bar = svg.selectAll(".bar")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "bar")
                        .attr("transform", function(d) {
                                return "translate(" + x(d.x) + "," + y(d.y) + ")";
                        });

                var rectangleIdPrefix = "";
                if (barID=="bar1") {
                        rectangleIdPrefix = ".Arect";
                } else {
                        rectangleIdPrefix = ".Brect";
                }

                bar.append("rect")
                        .attr("x", 1)
                        .style("fill", function(d) {
                                return barcolorScale(d.x + x(d.x));
                        })
                        .attr("width", 19)
                        .attr("height", function(d) {
                                return height - y(d.y);
                        })
                        .on("mouseover", function(d) {
                                var parent = d3.select(this.parentNode);
                                parent.append("text")
                                        .attr("class", "mono")
                                        .attr("x", 20 / 2)
                                        .attr("y", -2)
                                        .attr("text-anchor", "middle")
                                        .text(function(d) {
                                                return formatCount(d.y);
                                        });
                                var currentRect;
                                for (var i = 0; i < sensorMap.length; i++) {
                                        for (var j = 0; j < d.length; j++) {
                                                if (sensorMap[i][0] == d[j]) {
                                                        currentRect = rectangleIdPrefix + sensorMap[i][1];
                                                        d3.selectAll(currentRect).classed("histogram", true);
                                                }
                                        }
                                }
                        })
                        .on("mouseout", function(d) {
                                var parent = d3.select(this.parentNode);
                                var text = parent.select("text");
                                text.remove();
                                d3.selectAll(".selected").classed("histogram", false)
                        });

                svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                svg.append("g")
                        .attr("class", "y axis")
                //.attr("transform", "translate("+String(15)+",0)")
                .call(yAxis);

                var chartText = ""
                if (barID == "bar1") {
                        chartText = "Solution A"
                } else {
                        chartText = "Solution B"
                }

                svg.append("text")
                        .text(chartText + ": Illuminance values")
                        .attr("class", "mono")
                        .attr("x", 0)
                        .attr("y", 89);

        }

        /********** Build Line Chart **********/
        function updateLine(lineID, data) {
                var element = document.getElementById(lineID);
        }

        /********** Build Box Chart **********/
        function updateBox1(boxID, dataset) {
                if (!dataset || dataset.length == 0) {
                        return;
                }

                d3.select("#" + boxID).selectAll("svg").remove();

                vals = [];
                var data = [];
                data[0] = [];
                data[0][0] = "Solution A";
                data[0][1] = [];

                var formatCount = d3.format(",.0f");

                for (var i = 0, len = dataset.length; i < len; i++) {
                        val = dataset[i];
                        vals.push(formatCount(val.value));
                        data[0][1].push(formatCount(val.value));
                }

                // find median, compute upper and lower sets for heatmap interaction
                vals.sort();
                var sortMedian = 0;
                if (vals.length % 2 == 1) {
                        sortMedian = vals[Math.ceil(vals.length / 2) - 1]
                } else {
                        var m1 = Number(vals[vals.length / 2 - 1])
                        var m2 = Number(vals[vals.length / 2])
                        sortMedian = (m1 + m2) / 2;
                }
                var lowerSet = [];
                var upperSet = [];
                for (var i = 0, len = dataset.length; i < len; i++) {
                        if (dataset[i].value < sortMedian) {
                                lowerSet.push(".Arect" + String(dataset[i].sensor));
                        } else {
                                upperSet.push(".Arect" + String(dataset[i].sensor));
                        }
                }

                var labels = true; // show the text labels beside individual boxplots

                var margin = {
                        top: 5,
                        right: 5,
                        bottom: 70,
                        left: 50
                };
                var width = 150 - margin.left - margin.right;
                var height = 350 - margin.top - margin.bottom;

                var chart = d3.box()
                        .whiskers(iqr(1.5))
                        .height(height)
                        .domain([d3.min(vals), d3.max(vals)])
                        .showLabels(labels);

                var svg = d3.select("#" + boxID).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("class", "box")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // the x-axis
                var x = d3.scale.ordinal()
                        .domain(data.map(function(d) {
                                return d[0]
                        }))
                        .rangeRoundBands([0, width], 0.7, 0.3);

                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                // the y-axis
                var y = d3.scale.linear()
                        .domain([d3.min(vals), d3.max(vals)])
                        .range([height + margin.top, 0 + margin.top]);

                var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                // draw the boxplots
                svg.selectAll(".box")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", function(d) {
                                return "translate(" + x(d[0]) + "," + margin.top + ")";
                        })
                        .call(chart.width(25))
                        .on("mouseover", function(d) {
                                // console.log("mouseover: " + d);
                                pos = d3.mouse(this);
                                var medianY = d3.select(".median").attr("y1")
                                var diff = pos[1] - medianY;
                                if (diff < 0) { // upper half
                                        for (var i = 0, len = upperSet.length; i < len; i++) {
                                                d3.select(upperSet[i]).classed("histogram", true);
                                        }
                                } else { // lower half
                                        for (var i = 0, len = lowerSet.length; i < len; i++) {
                                                d3.select(lowerSet[i]).classed("histogram", true);
                                        }
                                }
                        })
                        .on("mouseout", function(d) {
                                for (var i = 0, len = upperSet.length; i < len; i++) {
                                        d3.select(upperSet[i]).classed("histogram", false);
                                }
                                for (var i = 0, len = lowerSet.length; i < len; i++) {
                                        d3.select(lowerSet[i]).classed("histogram", false);
                                }
                        });

                // draw y axis
                svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text") // and text1
                .attr("transform", "rotate(-90)")
                        .attr("y", -45)
                        .attr("dy", ".91em")
                        .style("text-anchor", "end")
                        .attr("class", "titleText")
                        .text("Illuminance(lux)");

                // draw x axis
                svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height + margin.top + 10) + ")")
                        .call(xAxis)
                        .append("text"); // text label for the x axis

        }

        /********** Build Box Chart **********/
        function updateBox2(boxID, dataset) {
                if (!dataset || dataset.length == 0) {
                        return;
                }

                d3.select("#" + boxID).selectAll("svg").remove();

                vals = [];
                var data = [];
                data[0] = [];
                data[0][0] = "Solution B";
                data[0][1] = [];

                var formatCount = d3.format(",.0f");

                for (var i = 0, len = dataset.length; i < len; i++) {
                        val = dataset[i];
                        vals.push(formatCount(val.value));
                        data[0][1].push(formatCount(val.value));
                }

                // find median, compute upper and lower sets for heatmap interaction
                vals.sort();
                var sortMedian = 0;
                if (vals.length % 2 == 1) {
                        sortMedian = vals[Math.ceil(vals.length / 2) - 1]
                } else {
                        var m1 = Number(vals[vals.length / 2 - 1])
                        var m2 = Number(vals[vals.length / 2])
                        sortMedian = (m1 + m2) / 2;
                }
                var lowerSet = [];
                var upperSet = [];
                for (var i = 0, len = dataset.length; i < len; i++) {
                        if (dataset[i].value < sortMedian) {
                                lowerSet.push(".Brect" + String(dataset[i].sensor));
                        } else {
                                upperSet.push(".Brect" + String(dataset[i].sensor));
                        }
                }

                var labels = true; // show the text labels beside individual boxplots

                var margin = {
                        top: 5,
                        right: 5,
                        bottom: 70,
                        left: 30
                };
                var width = 150 - margin.left - margin.right;
                var height = 350 - margin.top - margin.bottom;

                var chart = d3.box()
                        .whiskers(iqr(1.5))
                        .height(height)
                        .domain([d3.min(vals), d3.max(vals)])
                        .showLabels(labels);

                var svg = d3.select("#" + boxID).append("svg")
                        .attr("width", width + margin.right + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("class", "box")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // the x-axis
                var x = d3.scale.ordinal()
                        .domain(data.map(function(d) {
                                return d[0]
                        }))
                        .rangeRoundBands([0, width], 0.7, 0.3);

                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                // the y-axis
                var y = d3.scale.linear()
                        .domain([d3.min(vals), d3.max(vals)])
                        .range([height + margin.top, 0 + margin.top]);

                var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                // draw the boxplots
                svg.selectAll(".box")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", function(d) {
                                return "translate(" + x(d[0]) + "," + margin.top + ")";
                        })
                        .call(chart.width(25))
                        .on("mouseover", function(d) {
                                // console.log("mouseover: " + d);
                                pos = d3.mouse(this);
                                var medianY = d3.select(".median").attr("y1")
                                var diff = pos[1] - medianY;
                                if (diff < 0) { // upper half
                                        for (var i = 0, len = upperSet.length; i < len; i++) {
                                                d3.select(upperSet[i]).classed("histogram", true);
                                        }
                                } else { // lower half
                                        for (var i = 0, len = lowerSet.length; i < len; i++) {
                                                d3.select(lowerSet[i]).classed("histogram", true);
                                        }
                                }
                        })
                        .on("mouseout", function(d) {
                                for (var i = 0, len = upperSet.length; i < len; i++) {
                                        d3.select(upperSet[i]).classed("histogram", false);
                                }
                                for (var i = 0, len = lowerSet.length; i < len; i++) {
                                        d3.select(lowerSet[i]).classed("histogram", false);
                                }
                        });

                // draw y axis
                svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text") // and text1
                .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .style("font-size", "16px");
                // .text("Lux values");

                // draw x axis
                svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height + margin.top + 10) + ")")
                        .call(xAxis)
                        .append("text"); // text label for the x axis

        }

        // Returns a function to compute the interquartile range.
        function iqr(k) {
                return function(d, i) {
                        var q1 = d.quartiles[0],
                                q3 = d.quartiles[2],
                                iqr = (q3 - q1) * k,
                                i = -1,
                                j = d.length;
                        while (d[++i] < q1 - iqr);
                        while (d[--j] > q3 + iqr);
                        return [i, j];
                };
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
        var graphAnnotate = function(rootSvg, colorScale, title, legendAddZero) {
                var dayLabels = rootSvg.selectAll(".dayLabel")
                        .data(days)
                        .enter().append("text")
                        .text(function(d) {
                                return d;
                        })
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                                return i * gridSize;
                        })
                        .style("text-anchor", "end")
                        .attr("transform", "translate(-4," + gridSize / 1.5 + ")")
                        .attr("class", function(d, i) {
                                return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
                        });

                var timeLabels = rootSvg.selectAll(".timeLabel")
                        .data(times)
                        .enter().append("text")
                        .text(function(d) {
                                return d;
                        })
                        .attr("x", function(d, i) {
                                return i * gridSize;
                        })
                        .attr("y", 0)
                        .style("text-anchor", "middle")
                        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                        .attr("class", function(d, i) {
                                return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
                        });

                legendData = []
                if (legendAddZero) {
                        legendData = [0].concat(colorScale.quantiles())
                } else {
                        legendData = colorScale.quantiles();
                }
                var legend = rootSvg.selectAll(".legend")
                        .data(legendData, function(d) {
                                return d;
                        })
                        .enter().append("g")
                        .attr("class", "legend");

                colorList = colorScale.range();
                legend.append("rect")
                        .attr("x", 170)
                        .attr("y", function(d, i) {
                                return gridSize * i;
                        })
                        .attr("width", gridSize / 2)
                        .attr("height", gridSize)
                        .style("fill", function(d, i) {
                                return colorList[i];
                        });

                legend.append("text")
                        .attr("class", "mono")
                        .text(function(d) {
                                return "≥ " + Math.round(d);
                        })
                        .attr("x", 170 + 12)
                        .attr("y", function(d, i) {
                                return gridSize + (gridSize * i)
                        });

                rootSvg.append("text")
                        .attr("class", "titleText")
                        .text(title)
                        .attr("x", 0)
                        .attr("y", 320);

        }

        /********** Brush Snap To Grid **********/
        var brushSnap = function(extent) {
                // snap to grid
                extent[0][0] = Math.round(extent[0][0] / gridSize) * gridSize;
                extent[0][1] = Math.round(extent[0][1] / gridSize) * gridSize;
                extent[1][0] = Math.round(extent[1][0] / gridSize) * gridSize;
                extent[1][1] = Math.round(extent[1][1] / gridSize) * gridSize;

                // limit to grid area
                extent[1][0] = Math.min(extent[1][0], 160);
                extent[1][1] = Math.min(extent[1][1], 300);

                return extent;
        }

        /********** Graph callback **********/
        var graphCallbackOne = function(error, data) {
                data_loaded[0] = true;

                var colorScale = d3.scale.quantile()
                        .domain([15, 950]) //global min and max values from CSV file
                        .range(colors);

                var svg = d3.select("#charta").append("svg")
                        .attr("width", 250)
                        .attr("height", 370)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // quadtree data structure to optimized brush selection searching
                var quadtree = d3.geom.quadtree(data, -1, -1, width + 1, height + 1);

                var heatMap = svg.selectAll(".hour")
                        .data(nodes(quadtree))
                        .enter().append("rect")
                        .attr("x", function(d) {
                                return d.point.x;
                        })
                        .attr("y", function(d) {
                                return d.point.y;
                        })
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("class", function(d) {
                                classStr = "hour bordered ";
                                classStr += "Arect" + String(d.point.sensor);
                                return classStr;
                        })
                        .attr("width", gridSize)
                        .attr("height", gridSize)
                        .style("fill", colors[0]);
                heatMapOneGlobalData = heatMap;

                heatMap.transition().duration(1000)
                        .style("fill", function(d) {
                                return colorScale(d.point.value);
                        });

                heatMap.append("title").text(function(d) {
                        return d.point.value;
                });

                graphAnnotate(svg, colorScale, "Solution A", true);

                // brush selection logic.
                function brushed1() {
                        var selectedNodes = [];
                        var extent = brushSnap(heatmapBrush1.extent());

                        heatMap.each(function(d) {
                                d.point.selected = false;
                        });
                        search(quadtree, extent[0][0] - 15, extent[0][1] - 15, extent[1][0], extent[1][1]);
                        heatMap.classed("selected", function(d) {
                                if (d.point.selected) selectedNodes.push(d.point);
                                return d.point.selected;
                        });
                        updateBar('bar1', selectedNodes);

                        if (!d3.event.sourceEvent) return;
                        updateBox1('box1', selectedNodes);
                        d3.select(this).transition()
                                .call(heatmapBrush1.extent(extent))
                                .call(heatmapBrush1.event);
                        // synchronize other graph
                        d3.select('.heatmapbrush2').transition()
                                .call(heatmapBrush2.extent(extent))
                                .call(heatmapBrush2.event);
                        d3.select('.heatmapbrush3').transition()
                                .call(heatmapBrush3.extent(extent))
                                .call(heatmapBrush3.event);
                }

                heatmapBrush1 = d3.svg.brush()
                        .x(d3.scale.identity().domain([0, width]))
                        .y(d3.scale.identity().domain([0, height]))
                        .extent([
                                [0, 0],
                                [20, 300]
                        ])
                        .on("brushend", brushed1);

                svg.append("g")
                        .attr("class", "heatmapbrush1")
                        .call(heatmapBrush1);
                addFilter();
        }

        var graphCallbackTwo = function(error, data) {
                data_loaded[1] = true;
                // var colorScale = d3.scale.quantile()
                //         .domain([d3.min(data, function(d) {
                //                         return d.value;
                //                 }),
                //                 buckets - 1,
                //                 d3.max(data, function(d) {
                //                         return d.value;
                //                 })
                //         ])
                //         .range(colors);
                var colorScale = d3.scale.quantile()
                        .domain([15, 950])
                        .range(colors);


                var svg = d3.select("#chartb").append("svg")
                        .attr("width", 250)
                        .attr("height", 370)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // quadtree data structure to optimized brush seleciton searching
                var quadtree = d3.geom.quadtree(data, -1, -1, width + 1, height + 1);

                var heatMap = svg.selectAll(".hour")
                        .data(nodes(quadtree))
                        .enter().append("rect")
                        .attr("x", function(d) {
                                return d.point.x;
                        })
                        .attr("y", function(d) {
                                return d.point.y;
                        })
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("class", function(d) {
                                classStr = "hour bordered ";
                                classStr += "Brect" + String(d.point.sensor);
                                return classStr;
                        })
                        .attr("width", gridSize)
                        .attr("height", gridSize)
                        .style("fill", colors[0]);
                heatMapTwoGlobalData = heatMap;

                heatMap.transition().duration(1000)
                        .style("fill", function(d) {
                                return colorScale(d.point.value);
                        });

                heatMap.append("title").text(function(d) {
                        return d.point.value;
                });

                graphAnnotate(svg, colorScale, "Solution B", true);

                // brush selection logic.
                function brushed2() {
                        var selectedNodes = [];
                        var extent = brushSnap(heatmapBrush2.extent());

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
                        updateBox2('box2', selectedNodes);
                        d3.select(this).transition()
                                .call(heatmapBrush2.extent(extent))
                                .call(heatmapBrush2.event);
                        // synchronize other graph
                        d3.select('.heatmapbrush1').transition()
                                .call(heatmapBrush1.extent(extent))
                                .call(heatmapBrush1.event);
                        d3.select('.heatmapbrush3').transition()
                                .call(heatmapBrush3.extent(extent))
                                .call(heatmapBrush3.event);
                }

                heatmapBrush2 = d3.svg.brush()
                        .x(d3.scale.identity().domain([0, width]))
                        .y(d3.scale.identity().domain([0, height]))
                        .extent([
                                [0, 0],
                                [20, 300]
                        ])
                        .on("brushend", brushed2);

                svg.append("g")
                        .attr("class", "heatmapbrush2")
                        .call(heatmapBrush2);
                addFilter();
        }

        var graphCallbackThree = function(error, data) {
                var deltaMin = d3.min(data, function(d) {
                        return d.value;
                });
                var deltaMax = d3.max(data, function(d) {
                        return d.value;
                });

                var colorScale = d3.scale.linear()
                        .domain([deltaMin, 0, deltaMax])
                        .range(["rgb(33,102,172)", "rgb(247,247,247)", "rgb(178,24,43)"])
                        .interpolate(d3.interpolateRgb);

                // hack to make this color scale compatible with the graphAnnotate function
                // for drawing the legend
                colorScale.quantiles = function() {
                        return [deltaMin, 0, deltaMax];
                }

                var svg = d3.select("#chartc").append("svg")
                        .attr("width", 250)
                        .attr("height", 370)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // quadtree data structure to optimized brush seleciton searching
                var quadtree = d3.geom.quadtree(data, -1, -1, width + 1, height + 1);

                var heatMap = svg.selectAll(".hour")
                        .data(nodes(quadtree))
                        .enter().append("rect")
                        .attr("x", function(d) {
                                return d.point.x;
                        })
                        .attr("y", function(d) {
                                return d.point.y;
                        })
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("class", "bordered")
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

                graphAnnotate(svg, colorScale, "Delta Map (A-B)", false);

                // brush selection logic.
                function brushed3() {
                        var selectedNodes = [];
                        var extent = brushSnap(heatmapBrush3.extent());

                        if (!d3.event.sourceEvent) return;

                        d3.select(this).transition()
                                .call(heatmapBrush3.extent(extent))
                                .call(heatmapBrush3.event);
                        // synchronize other graph
                        d3.select('.heatmapbrush1').transition()
                                .call(heatmapBrush1.extent(extent))
                                .call(heatmapBrush1.event);
                        d3.select('.heatmapbrush2').transition()
                                .call(heatmapBrush2.extent(extent))
                                .call(heatmapBrush2.event);
                }

                heatmapBrush3 = d3.svg.brush()
                        .x(d3.scale.identity().domain([0, width]))
                        .y(d3.scale.identity().domain([0, height]))
                        .extent([
                                [0, 0],
                                [20, 300]
                        ])
                        .on("brushend", brushed3);

                svg.append("g")
                        .attr("class", "heatmapbrush3")
                        .call(heatmapBrush3);
                addFilter();
        }

        /** Heatmap 1 ************************************/
        d3.csv("Solution_1.csv", dataFormat, graphCallbackOne);

        /** Heatmap 2 ************************************/
        d3.csv("Solution_2.csv", dataFormat, graphCallbackTwo);

        /** Delta Heatmap ************************************/
        d3.csv("Delta_map.csv", dataFormat, graphCallbackThree);

        /** Filter slider ******************************/
        var data_loaded = [false, false];
        var sliderCreated = false; // stop race conditions
        var addFilter = function() {
                if (!data_loaded[0] && !data_loaded[1]) return;
                if (sliderCreated) return;
                sliderCreated = true;
                d3.select("#slider").call(d3.slider().on("slide", function(evt, value) {
                                d3.select('#filtermin').text((value).toFixed());
                                var dataItems = d3.selectAll('.hour');
                                dataItems.filter(function(d, i) {
                                        if (d.point.value < value) {
                                                d3.select(this).classed("filter", true);
                                        } else {
                                                d3.select(this).classed("filter", false);
                                        }
                                });
                        })
                        .value(0)
                        .min(109)
                        .max(970));
        }
})();
