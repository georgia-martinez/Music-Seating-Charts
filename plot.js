function linspace(start, stop, num) {
    let arr = []

    let step = (start - stop) / (num - 1)

    for (let i = 0; i < num; i++) {
      arr.push(start + (step * i))
    }
    return arr
}

function getPoints(radius, stepSize) {

    let theta = linspace(0, Math.PI, stepSize)

    let x = theta.map(t => radius * Math.cos(t))
    let y = theta.map(t => radius * Math.sin(t))

    console.log([x, y, theta])

    return [x, y, theta]
}

TESTER = document.getElementById('tester')

function getTrace(radius, stepSize, line=true) {
    let points = getPoints(radius, stepSize)

    let x = points[0]
    let y = points[1] 

    let mode = line ? "lines" : "markers";

    let trace = {
        x: x, 
        y: y,
        mode: mode
    }

    return trace
}

function createChart(numSeats) {
    console.log("Create Chart")

    let radii = [3]
    let x = 3

    for(i = 1; i < numSeats.length; i++) {
        x += 3
        radii.push(x)
    }

    plotSeatingChart(radii, numSeats)
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

    let format = "M "+x0+" "+y0+" L "+x1+" "+y1+" L "+x2+" "+y2+" L " +x3+" "+y3+" Z"
    return format
}

function rotateX(x, y, x0, y0, theta) {
    return (x - x0) * Math.cos(theta) - (y - y0) * Math.sin(theta) + x0
}

function rotateY(x, y, x0, y0, theta) {
    return (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta) + y0
}

function plotSeatingChart(radii, numSeats) {
    console.log("Plot Seating Chart")

    console.log("numSeats" +numSeats)

    let all_traces = []
    let shapes = []

    for(i = 0; i < radii.length; i++) {
        let r = radii[i]
        let n = numSeats[i]

        // Plot a black line for each row
        let rowLine = getTrace(r, 1000, true) 
        all_traces.push(rowLine)

        if(n == 0) {
            continue
        }

        let seatThings = getTrace(r, n, false) 
        all_traces.push(seatThings)

        let points = getPoints(r, n)

        for(j = 0; j < n; j++) {        

            let all_x = points[0]
            let all_y = points[1] 
            let all_theta = points[2]

            for(k = 0; k < all_x.length; k++) {
                let path = rotatedSquare(all_x[k], all_y[k], all_theta[k], 1)

                seat = {
                    type: "path",
                    path: path,
                    fillcolor: "rgb(255, 255, 255)",
                    line: {
                      color: "rgb(0, 0, 0)"
                    }
                }

                shapes.push(seat)
            }
        }
    }
    
    let layout = {
        autosize: true,
        shapes: shapes
    }

    Plotly.newPlot(TESTER, all_traces, layout) 
}

