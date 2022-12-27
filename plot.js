SEATINGCHART = document.getElementById("seating-chart")

/**
 * Returns num evenly spaced points, calculated over the interval [start, stop] where the endpoint is incuded
 * 
 * @param {Number} start starting value
 * @param {Number} stop end value
 * @param {Number} num number of points to generate
 * @returns num evenly spaced points
 */
function linspace(start, stop, num) {
    let arr = []

    let step = (start - stop) / (num - 1)

    for (let i = 0; i < num; i++) {
        arr.push(start + (step * i))
    }

    return arr
}

/**
 * Returns a list of evenly spaced (x, y) and theta values given a radius and a stepsize
 * 
 * @param {Number} radius radius
 * @param {Number} stepSize number of points evenly spaced points to generate
 * @param {Boolean} flipChart gets bottom half of semicircle if true, otherwise gets the top half
 * @returns array containing [x, y, theta]
 */
function getPoints(radius, stepSize, flipChart) {

    let theta;

    if(stepSize != 1) {
        theta = flipChart ? linspace(0, Math.PI, stepSize) : linspace(-Math.PI, 0, stepSize);
    } else {
        theta = flipChart ? [3*Math.PI/2] : [Math.PI/2];
    }

    let x = theta.map(t => radius * Math.cos(t));
    let y = theta.map(t => radius * Math.sin(t));

    return [x, y, theta];
}

/**
 * Returns the trace of a semicircle to plot
 * 
 * @param {Number} radius radius
 * @param {Number} stepSize number of equally spaced points 
 * @param {Boolean} line true to plot a line, false to plot markers
 * @returns a trace of a semicircle to plot
 */
function getTrace(radius, stepSize, flipChart, line=true) {
    let points = getPoints(radius, stepSize, flipChart);

    let x = points[0];
    let y = points[1];

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

    return trace;
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
    let l = len/2;

    let rot_x = [];
    let rot_y = [];

    // Rotate the four points of the square
    for(let xVal of [x - l, x + l]) {
        for(let yVal of [y - l, y + l]) {
            rot_x.push((xVal - x) * Math.cos(theta) - (yVal - y) * Math.sin(theta) + x);
            rot_y.push((xVal - x) * Math.sin(theta) + (yVal - y) * Math.cos(theta) + y);
        }
    }

    // Index 2 and 3 are swapped so the square is drawn correctly
    let x0 = rot_x[0];
    let x1 = rot_x[1];
    let x2 = rot_x[3];
    let x3 = rot_x[2];

    let y0 = rot_y[0];
    let y1 = rot_y[1];
    let y2 = rot_y[3];
    let y3 = rot_y[2];

    let format = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;

    return format;
}

/**
 * Returns an array of numbers specifying the radius value for each row
 * 
 * @param {*} R length between each row
 * @param {Array.<Number>} numSeats number of seats for each row 
 * @returns array of radii corresponding to each row
 */
function getRadii(R, numSeats) {
    let x = R;
    let radii = [R];

    for(i = 1; i < numSeats.length; i++) {
        x += R;
        radii.push(x);
    }

    return radii;
}

/**
 * Plots the seating chart
 * 
 * @param {String} title 
 * @param {Array.<Number>} radii 
 * @param {Array.<Number>} numSeats 
 * @param {Array.<Array.<String>>} namesList array of arrays containing the names for each row
 * @param {Boolean} flipChart plots the bottom half of semicircle if true, otherwise plots the top half
 */
function plotSeatingChart(title, numSeats, namesList, showPodium, flipChart) {
    let all_traces = [];
    let shapes = [];
    let annotations = [];
    let radii = getRadii(3, numSeats);

    // Iterate through every radius value
    for(i = 0; i < radii.length; i++) {
        let r = radii[i];
        let n = numSeats[i];

        let names = namesList[i];

        // Plot a black line for each row
        let rowLine = getTrace(r, 1000, flipChart, true);
        all_traces.push(rowLine);

        if(n == 0) {
            continue;
        }

        // Iterate through every seat
        let points = getPoints(r, n, flipChart);
        let all_x = points[0];
        let all_y = points[1] ;
        let all_theta = points[2];

        for(j = 0; j < all_x.length; j++) {
            let path = rotatedSquare(all_x[j], all_y[j], all_theta[j], 1);

            seat = {
                type: "path",
                path: path,
                fillcolor: "rgb(255, 255, 255)",
                line: { color: "rgb(0, 0, 0)" }
            }

            shapes.push(seat);

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

            annotations.push(nameText);
        }
    }
    
    // Plot the podium 
    if(showPodium) {
        podium = getPodium();

        shapes.push(podium[0]);
        annotations.push(podium[1]);
    }

    let layout = {
        title: { text:title },
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

    Plotly.newPlot(SEATINGCHART, all_traces, layout, config);
}

/**
 * @returns an array containing the podium shape first and the text second
 */
function getPodium() {

    let width = 2;
    let height = 1;

    let podium = {
        type: 'rect',
        x0: -width/2,
        y0: -height/2,
        x1: width/2,
        y1: height/2,
        fillcolor: "rgb(255, 255, 255)",
        line: { color: "rgb(0, 0, 0)" }
    }

    let text = {
        x: 0,
        y: 0,
        xref: "x",
        yref: "y",
        text: "Podium",
        showarrow: false,
        borderwidth: 1,
        borderpad: 1,
        bgcolor: "#ffffff"
    }

    return [podium, text];
}

/**
 * Downloads the chart as an image
 * 
 * @param {*} fileName name of the file
 * @param {*} imageFormat image format to save the file (e.g. png or jpeg)
 */
function downloadChart(fileName, imageFormat) {
    Plotly.newPlot(SEATINGCHART, SEATINGCHART.data, SEATINGCHART.layout, SEATINGCHART.config)
    .then(function(download) {
        Plotly.downloadImage(download, {
            format: imageFormat,
            filename: fileName
        })
    });
}
