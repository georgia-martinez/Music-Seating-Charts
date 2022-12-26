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

/**
 * Given a (x, y) point representing the center of a square and the side length (len), returns the square rotated by theta (in radians) from the square's center as a Plotly formatted string  
 * 
 * @param {Number} x center x 
 * @param {Number} y center y
 * @param {Number} theta angle to rotate by (in radians)
 * @param {Number} len side length of the square
 * @returns Plotly formatted string representing the rotated square
 */
function rotatedSquare(x, y, theta, len) {
    let l = len/2

    let rot_x = []
    let rot_y = []

    // Rotate the four points of the square
    for(let x1 of [x - l, x + l]) {
        for(let y1 of [y - l, y + l]) {
            rot_x.push((x1 - x) * Math.cos(theta) - (y1 - y) * Math.sin(theta) + x)
            rot_y.push((x1 - x) * Math.sin(theta) + (y1 - y) * Math.cos(theta) + y)
        }
    }

    // Index 2 and 3 are swapped so the square is drawn correctly
    x0 = rot_x[0], x1 = rot_x[1], x2 = rot_x[3], x3 = rot_x[2]
    y0 = rot_y[0], y1 = rot_y[1], y2 = rot_y[3], y3 = rot_y[2]

    let format = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`

    return format
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

