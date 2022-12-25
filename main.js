let numRows = 1

let rowContainer = document.getElementById("row-container")
let addRowButton = document.getElementById("add-row")
let createChartButton = document.getElementById("create-chart")

createChartButton.addEventListener("click", function() {
    var inputs = rowContainer.getElementsByTagName("input");

    var seatsPerRow = []

    for(i = 0; i < inputs.length; i++) {
        var currInput = inputs[i];

        if(currInput.value) {
            seatsPerRow.push(parseInt(inputs.valueAsNumber));
        } else {    
            seatsPerRow.push(-1)
        }
    }

    createChart(seatsPerRow)
})

addRowButton.addEventListener("click", function() {
    
    // Div for each row
    var rowDiv = document.createElement("div")
    rowDiv.classList.add("flex")

    // Row text
    var rowText = document.createElement("p")
    rowText.classList.add("paragraph-styling")
    
    rowText.innerText = "Row " +numRows
    numRows += 1

    // Input for the # of seats
    var seatInput = document.createElement("input")
    seatInput.setAttribute("type", "text")
    seatInput.defaultValue = "0"

    // Remove row button
    var removeRowButton = document.createElement("button")
    removeRowButton.textContent = "X"
    
    rowDiv.appendChild(rowText)
    rowDiv.appendChild(seatInput)
    rowDiv.appendChild(removeRowButton)
    
    removeRowButton.addEventListener("click", function() {
        this.parentNode.remove()
        renumberRows(rowText.innerText)
    })

    rowContainer.appendChild(rowDiv)
})

function renumberRows(rowText) {
    var allRowText = rowContainer.getElementsByTagName("p")

    var start = parseInt(rowText.slice(-1)) - 1

    for(i = start; i < allRowText.length; i++) {
        var row = allRowText[i]
        row.innerText = "Row " +(i+1)
    }

    numRows -= 1
}

