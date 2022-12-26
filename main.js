let numRows = 0

let rowContainer = document.getElementById("row-container")
let editContainer = document.getElementById("edit-container")
let addRowButton = document.getElementById("add-row")
let chartTitle = document.getElementById("chart-title")
let editRowText = document.getElementById("edit-row-text")

addRowButton.addEventListener("click", function() { addRow() })
chartTitle.addEventListener("change", function() { createChartBttn() })

class Row {
    constructor(rowNum, seatInput, textArea) {
        this.rowNum = rowNum
        this.seatInput = seatInput
        this.textArea = textArea
    }

    getRowNum() {
        return this.rowNum
    }

    setRowNum(rowNum) {
        this.rowNum = rowNum
    }

    getSeatInput() {
        return this.seatInput
    }

    getNumSeats() {
        return this.seatInput.value;
    }

    getTextArea() {
        return this.textArea
    }

    getNames() {
        return this.textArea.value
    }
}

var rowMap = new Map()

function createChartBttn() {
    let seatsPerRow = []
    let namesPerRow = []

    for(let row of rowMap.values()) {
        seatsPerRow.push(parseInt(row.getNumSeats()))
        namesPerRow.push(row.getNames())
    }

    namesList = getNames(namesPerRow, seatsPerRow)

    createChart(chartTitle.value, seatsPerRow, namesList)
}

function getNames(namesPerRow, seatsPerRow) {
    namesList = []

    for(let i = 0; i < seatsPerRow.length; i++) {
        let names = namesPerRow[i].split(/\n/)
        let end = seatsPerRow[i] - names.length
    
        for(let j = 0; j < end; j++) {
            names.push("")
        }

        namesList.push(names)
    }

    return namesList
}

function addRow() {

    // Div for each row
    let rowDiv = document.createElement("div")
    rowDiv.classList.add("flex")
    rowDiv.classList.add("flex-item")

    // Row text
    let rowText = document.createElement("p")

    numRows += 1
    rowText.innerText = "Row " +numRows

    textarea = document.createElement("textarea")
    textarea.rows = 20
    textarea.cols = 25
    textarea.placeholder = "FirstName1 LastName1\nFirstName2 LastName2\netc..."
    textarea.addEventListener("change", () => { createChartBttn() })

    // Input for the # of seats
    let seatInput = document.createElement("input")
    seatInput.setAttribute("type", "text")
    seatInput.defaultValue = "0"

    seatInput.addEventListener("change", function() { createChartBttn() })

    let newRow = new Row(rowText.innerText, seatInput, textarea)

    rowMap.set(rowText.innerText, newRow)

    // Edit row button
    let editRowButton = document.createElement("button")
    editRowButton.textContent = "Edit"

    editRowButton.addEventListener("click", function() { editRow(rowText.innerText) })

    // Remove row button
    let removeRowButton = document.createElement("button")
    removeRowButton.textContent = "X"

    rowDiv.appendChild(rowText)
    rowDiv.appendChild(seatInput)
    rowDiv.appendChild(editRowButton)
    rowDiv.appendChild(removeRowButton)    

    removeRowButton.addEventListener("click", function() { removeRow(this.parentNode, rowText) })

    rowContainer.appendChild(rowDiv)

    createChartBttn()
}

function editRow(rowTextInner) {
    editRowText.innerText = rowTextInner + " Names:"

    while (editContainer.firstChild) {
        editContainer.removeChild(editContainer.firstChild);
    }
    
    let nameBox = rowMap.get(rowTextInner).getTextArea()

    editContainer.appendChild(nameBox)
}

function removeRow(parentNode, rowText) {
    if(numRows > 1) {
        numRows -= 1    

        parentNode.remove()

        rowMap.delete(rowText.innerText)
    
        renumberRows(rowText.innerText)
        createChartBttn()
    }
}

function renumberRows(rowText) {
    let allRowText = rowContainer.getElementsByTagName("p")

    let start = parseInt(rowText.slice(-1)) - 1

    for(i = start; i < allRowText.length; i++) {
        let row = allRowText[i]
        row.innerText = "Row " +(i+1)
    }

    // Create a new rowMap retaining the same textareas
    let newRowMap = new Map()

    let count = 1
    for (const value of rowMap.values()) {
        let key = "Row " +count
        value.setRowNum(key)

        newRowMap.set(key, value)
        count += 1
    }

    rowMap = newRowMap
}

function main() {
    addRow()
    editRow("Row 1")
}

main()