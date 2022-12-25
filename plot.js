function linspace(start, stop, num) {
    var arr = []

    var step = (start - stop) / (num - 1)

    for (var i = 0; i < num; i++) {
      arr.push(start + (step * i))
    }
    return arr
}

function getPoints(radius, stepSize) {

    var theta = linspace(0, Math.PI, stepSize)

    var x = theta.map(t => radius * Math.cos(t))
    var y = theta.map(t => radius * Math.sin(t))

    return [x, y]
}

TESTER = document.getElementById('tester')

function getTrace(radius) {
    points = getPoints(radius, 1000)

    var x = points[0]
    var y = points[1] 

    var trace = {x: x, y: y}

    return trace
}

var all_traces = []
var radii = []

function plotSeatingChart() {
    if(radii.length == 0) {
        radii.push(3);
    } else {
        radii.push(radii.at(-1) + 3);
    }

    radius = radii.at(-1);
    
    trace = getTrace(radius)

    all_traces.push(trace)

    var layout = {
        autosize: true,
    }

    Plotly.newPlot(TESTER, all_traces, layout) 
}