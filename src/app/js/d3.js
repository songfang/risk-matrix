

var dispatch = d3.dispatch("load");

var canvas = d3.select('#risk-matrix'),
    diagramWidth = +(canvas.style('width').replace('px', '')),
    diagramHeight = +(canvas.style('height').replace('px', ''))
    y = d3.scaleLinear()
          .domain([0, 1])
          .range([diagramHeight, 0]),
    axisLeft = d3.axisLeft(y),
    xDefault = d3.scaleLinear()
                .domain([0, 1])
                .range([0, diagramWidth]),
    axisBottomDefault = d3.axisBottom(xDefault),
    chart = canvas.append('g')
              .attr('transform', 'translate(50, 40),scale(.8)')
    ;

chart.call(axisLeft);
chart.append('g').attr('id', 'dots').attr('transform', 'translate(0,' + diagramHeight + ')').call(axisBottomDefault);

dispatch.on('load', function(data) {

  d3.select('#dots').remove();

  drawBackground();

  var dots = chart.append('g').attr('id', 'dots');

  var max = d3.max(data, function(d) { return d.costs; }) * 1.1,
      x = d3.scaleLinear()
          .domain([0, max])
          .range([0, diagramWidth]),
      axisBottom = d3.axisBottom(x).tickValues(d3.range(0, Math.ceil(max)))
      ;

  dots.append('g').attr('transform', 'translate(0,' + diagramHeight + ')').call(axisBottom);

  dots.selectAll('circle')
      .data(data)
    .enter().append('circle')
      .classed('circle', true)
      .attr('cx', function(d) { return x(d.costs); })
      .attr('cy', function(d) { return y(d.propability); })
  ;

});

function drawBackground() {

  d3.select('#background').remove();

  var bg = chart.append('g').attr('id', 'background');

  var xAxis = _.clone(settings.grid.xAxis);
  var yAxis = _.clone(settings.grid.yAxis);

  xAxis.push(1);
  yAxis.push(1);
 
  var xLower = 0;

  for(var i = 0; i < xAxis.length; i++) {

    var xUpper = xAxis[i];

    var yLower = 0;
    for(var j = 0; j < yAxis.length; j++) {
      var yUpper = yAxis[j];

      drawRect(bg, xLower, xUpper, yLower, yUpper);

      yLower = yUpper;
    }

    xLower = xUpper;
  }

}

var maxDistance = Math.sqrt(diagramWidth * diagramWidth + diagramHeight * diagramHeight),
    margin = maxDistance / 2,
    bgColor0 = d3.scaleLinear()
                .domain([0, margin])
                .range(["green", "yellow"]),
    bgColor1 = d3.scaleLinear()
                .domain([margin, maxDistance])
                .range(["yellow", "red"])
    ;

function drawRect(bg, xLower, xUpper, yLower, yUpper) {

  xLower = xLower * diagramWidth;
  xUpper = xUpper * diagramWidth;
  yLower = yLower * diagramHeight;
  yUpper = yUpper * diagramHeight;

  var width = xUpper - xLower,
      height = yUpper - yLower,
      centerX = xLower + width / 2,
      centerY = yLower + height / 2,
      distance = Math.sqrt(centerX * centerX + centerY * centerY),
      color = distance < margin ? bgColor0(distance) : bgColor1(distance)
      ;

  bg.append('rect')
    .attr('x', xLower + 1).attr('width', width)
    .attr('y', diagramHeight - yLower - height).attr('height', height)
    .attr('style', 'fill:' + color + ';')
  ;
}