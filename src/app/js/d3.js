
var drawChart = (function(d3) {

  var canvas = d3.select('#risk-matrix'),
      diagramWidth = +(canvas.style('width').replace('px', '')),
      diagramHeight = +(canvas.style('height').replace('px', ''))
      y = d3.scaleLinear()
            .domain([0, 1])
            .range([0, diagramHeight]),
      axisLeft = d3.axisLeft(y),
      chart = canvas.append('g')
                .attr('transform', 'translate(50, 40),scale(.8)')
      ;

  chart.call(axisLeft);

  function generateChart(data) {

    var max = d3.max(data, function(d) { return d.costs; }) * 1.1,
        x = d3.scaleLinear()
            .domain([0, max])
            .range([0, diagramWidth]),
        axisBottom = d3.axisBottom(x).tickValues(d3.range(0, Math.ceil(max)))
        ;

    chart.append('g').attr('transform', 'translate(0,' + diagramHeight + ')').call(axisBottom);

    chart.selectAll('circle')
        .data(data)
      .enter().append('circle')
        .classed('circle', true)
        .attr('cx', function(d) { return x(d.costs); })
        .attr('cy', function(d) { return y(d.propability); })
    ;

  };

  return generateChart;

})(d3)

var data = [
  { pisition: 'a', costs: 100, propability: 100 }
];

//drawChart(data);
