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

function getTrace(radius, stepSize, line=true) {
    points = getPoints(radius, stepSize)

    var x = points[0]
    var y = points[1] 

    var mode = line ? "lines" : "markers";

    var trace = {
        x: x, 
        y: y,
        mode: mode
    }

    return trace
}

// function addRow() {
//     if(radii.length == 0) {
//         radii.push(3);
//     } else {
//         radii.push(radii.at(-1) + 3);
//     }

//     numSeats.push(-1)
//     plotSeatingChart()
// }

function createChart(numSeats) {
    console.log("Create Chart")

    var radii = [3]
    var x = 3

    for(i = 1; i < numSeats.length; i++) {
        x += 3
        radii.push(x)
    }

    plotSeatingChart(radii, numSeats)
}

function plotSeatingChart(radii, numSeats) {
    console.log("Plot Seating Chart")

    var all_traces = []

    for(i = 0; i < radii.length; i++) {
        r = radii[i]
        n = numSeats[i]

        if(n != 0) {
            line = false 
        } else {
            line = true
            n = 1000
        }

        trace = getTrace(r, n, line)
        all_traces.push(trace)
    }
    
    var layout = {
        autosize: true,
    }

    Plotly.newPlot(TESTER, all_traces, layout) 
}

