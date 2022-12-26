SEATINGCHART = document.getElementById("seating-chart")

function linspace(start, stop, num) {
    let arr = []

    if(num != 1) {
        let step = (start - stop) / (num - 1)

        for (let i = 0; i < num; i++) {
          arr.push(start + (step * i))
        }
    } else {
        arr.push(3*Math.PI/2)
    }

    return arr
}

function getPoints(radius, stepSize) {

    let theta = linspace(0, Math.PI, stepSize)

    let x = theta.map(t => radius * Math.cos(t))
    let y = theta.map(t => radius * Math.sin(t))

    return [x, y, theta]
}

function getTrace(radius, stepSize, line=true) {
    let points = getPoints(radius, stepSize)

    let x = points[0]
    let y = points[1] 

    let mode = line ? "lines" : "markers";

    let trace = {
        x: x, 
        y: y,
        mode: mode,
        hoverinfo: "skip",
        line: {
            color: "rgb(0, 0, 0)",
        }
    }

    return trace
}

function createChart(title, numSeats, namesList) {

    const N = 3

    let x = N
    let radii = [N]

    for(i = 1; i < numSeats.length; i++) {
        x += N
        radii.push(x)
    }

    plotSeatingChart(title, radii, numSeats, namesList)
}

function rotatedSquare(x, y, theta, len) {
    let l = len/2

    // Bottom right
    let x0 = x - l
    let y0 = y - l

    // top left
    let x1 = x - l
    let y1 = y + l

    // top right
    let x2 = x + l
    let y2 = y + l

    // bottom right
    let x3 = x + l
    let y3 = y - l

    let all_x = [x0, x1, x2, x3]
    let all_y = [y0, y1, y2, y3]

    let rot_x = []
    let rot_y = []

    for(let i = 0; i < all_x.length; i++) {
        rot_x.push(rotateX(all_x[i], all_y[i], x, y, theta))
        rot_y.push(rotateY(all_x[i], all_y[i], x, y, theta))
    }

    x0 = rot_x[0]
    x1 = rot_x[1]
    x2 = rot_x[2]
    x3 = rot_x[3]

    y0 = rot_y[0]
    y1 = rot_y[1]
    y2 = rot_y[2]
    y3 = rot_y[3]

    let format = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`

    return format
}

function rotateX(x, y, x0, y0, theta) {
    return (x - x0) * Math.cos(theta) - (y - y0) * Math.sin(theta) + x0
}

function rotateY(x, y, x0, y0, theta) {
    return (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta) + y0
}

function plotSeatingChart(title, radii, numSeats, namesList) {
    let all_traces = []
    let shapes = []
    let annotations = []

    // Iterate through every radius value
    for(i = 0; i < radii.length; i++) {
        let r = radii[i]
        let n = numSeats[i]

        let names = namesList[i]

        // Plot a black line for each row
        let rowLine = getTrace(r, 1000, true) 
        all_traces.push(rowLine)

        if(n == 0) {
            continue
        }

        let points = getPoints(r, n)
        let all_x = points[0]
        let all_y = points[1] 
        let all_theta = points[2]

        // Iterate through every seat
        for(j = 0; j < all_x.length; j++) {
            let path = rotatedSquare(all_x[j], all_y[j], all_theta[j], 1)

            seat = {
                type: "path",
                path: path,
                fillcolor: "rgb(255, 255, 255)",
                line: {
                    color: "rgb(0, 0, 0)"
                }
            }

            shapes.push(seat)

            nameText = {
                x: all_x[j],
                y: all_y[j],
                xref: "x",
                yref: "y",
                text: names[j],
                showarrow: false,
                borderwidth: 1,
                borderpad: 1,
                bgcolor: "#ffffff"
            }

            annotations.push(nameText)
        }
    }
    
    let layout = {
        title: {
            text:title
        },
        autosize: true,
        showlegend: false,
        shapes: shapes,
        xaxis: {
            showgrid: false, 
            zeroline: false,
            visible: false,
            fixedrange: true
        },
        yaxis: {
            showgrid: false, 
            zeroline: false,
            visible: false,
            fixedrange: true
        },
        annotations: annotations
    }

    let config = { 
        displayModeBar: false,
        responsive: true 
    }

    Plotly.newPlot(SEATINGCHART, all_traces, layout, config) 
}

