
var drawChart = (function(d3) {

  var chart = d3.select('#risk-matrix'),
      diagramWidth = +(chart.style('width').replace('px', '')),
      diagramHeight = +(chart.style('height').replace('px', ''))
      y = d3.scaleLinear()
            .domain([0, 1])
            .range([0, diagramHeight]),
      axisLeft = d3.axisLeft(y)
      ;


  function generateChart(data) {

    var x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.costs; }) * 1,1])
            .range([0, diagramWidth]),
        axisBottom = d3.axisBottom(x)
        ;


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
