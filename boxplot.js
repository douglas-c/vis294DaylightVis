// boxplot.js

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(200)
    .height(350);

// d3.csv("morley.csv", function(error, csv) {
//   var data = [];

//   csv.forEach(function(x) {
//     var e = Math.floor(x.Expt - 1),
//         r = Math.floor(x.Run - 1),
//         s = Math.floor(x.Speed),
//         d = data[e];
//     if (!d) d = data[e] = [s];
//     else d.push(s);
//     if (s > max) max = s;
//     if (s < min) min = s;
//   });

//   chart.domain([min, max]);

//   var svg = d3.select("body").selectAll("svg")
//       .data(data)
//     .enter().append("svg")
//       .attr("class", "box")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.bottom + margin.top)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//       .call(chart);

//   setInterval(function() {
//     svg.datum(randomize).call(chart.duration(1000));
//   }, 2000);
// });

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