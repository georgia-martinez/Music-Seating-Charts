let numRows = 1;

let rowContainer = document.getElementById("row-container")
let addRowButton = document.getElementById("add-row")

console.log(addRowButton);

addRowButton.addEventListener("click", function() {

    // Div for each row
    var rowDiv = document.createElement("div");
    rowDiv.classList.add("flex")

    // Row text
    var rowText = document.createElement("p");
    rowText.classList.add("paragraph-styling");
    
    rowText.innerText = "Row " +numRows;
    numRows += 1;

    // Input for the # of seats
    var seatInput = document.createElement("input");
    seatInput.setAttribute("type", "text");

    // Remove row button
    var removeRowButton = document.createElement("button");
    removeRowButton.textContent = "X";
    
    rowDiv.appendChild(rowText);
    rowDiv.appendChild(seatInput);
    rowDiv.appendChild(removeRowButton);
    
    removeRowButton.addEventListener("click", function() {
        this.parentNode.remove();
        renumberRows(rowText.innerText);
    });

    rowContainer.appendChild(rowDiv);
});

function renumberRows(rowText) {
    var allRowText = rowContainer.getElementsByTagName("p");

    var start = parseInt(rowText.slice(-1)) - 1;

    for(i = start; i < allRowText.length; i++) {
        var row = allRowText[i];
        row.innerText = "Row " +(i+1);
    }

    numRows -= 1;
}

function linspace(start, stop, num) {
    var arr = [];

    var step = (start - stop) / (num - 1);

    for (var i = 0; i < num; i++) {
      arr.push(start + (step * i));
    }
    return arr;
}

function getPoints(radius, stepSize) {

    var theta = linspace(0, Math.PI, stepSize);

    var x = theta.map(t => radius * Math.cos(t));
    var y = theta.map(t => radius * Math.sin(t));

    return [x, y];
}

TESTER = document.getElementById('tester');

function plot() {
    points = getPoints(3, 1000);

    x = points[0];
    y = points[1];

    Plotly.newPlot( TESTER, [{
        x: x,
        y: y }], {
        margin: { t: 0 } 
    });  
}