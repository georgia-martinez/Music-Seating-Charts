var numRows = 0;

const rowContainer = document.getElementById("row-container");
const editContainer = document.getElementById("edit-container");
const addRowButton = document.getElementById("add-row");
const chartTitle = document.getElementById("chart-title");
const editRowText = document.getElementById("edit-row-text");
const showPodium = document.getElementById("show-podium");
const flipChart = document.getElementById("flip-chart");

addRowButton.addEventListener("click", function() { addRow() });
chartTitle.addEventListener("change", function() { createChart() });
showPodium.addEventListener("change", function() { createChart() });
flipChart.addEventListener("change", function() { createChart() });

/**
 * Stores the row number ("Row 1"), a seat input Node, and a name text area Node for the corresponding row
 */
class Row {
    constructor(rowNumStr, seatInput, textArea) {
        this.rowNumStr = rowNumStr;
        this.seatInput = seatInput;
        this.textArea = textArea;
    }

    getRowNum() {
        return this.rowNumStr;
    }

    setRowNum(rowNumStr) {
        this.rowNumStr = rowNumStr;
    }

    getSeatInput() {
        return this.seatInput;
    }

    getNumSeats() {
        return this.seatInput.value;
    }

    getTextArea() {
        return this.textArea;
    }

    getNames() {
        return this.textArea.value;
    }
}

var rowMap = new Map(); // Maps the row text ("Row 1") to a Row object

/**
 * Creates the seating chart
 */
function createChart() {
    let seatsPerRow = [];
    let namesPerRow = [];

    for(let row of rowMap.values()) {
        seatsPerRow.push(parseInt(row.getNumSeats()));
        namesPerRow.push(row.getNames());
    }

    namesList = getNames(namesPerRow, seatsPerRow);

    plotSeatingChart(chartTitle.value, seatsPerRow, namesList, showPodium.checked, flipChart.checked);
}

/**
 * Formats the names into an array of arrays representing the names for each row. The input text (namesPerRow) is in the format ["Name1\nName2\", "Name1\nName2\", ...] and will be converted to [["Name1", "Name2"], ["Name1", "Name2"], ...]
 * 
 * @param {Array.<String>} namesPerRow names per row from the name text box
 * @param {Array.<String>} seatsPerRow number of seats per row
 * @returns array of arrays containing the names for each row
 */
function getNames(namesPerRow, seatsPerRow) {
    namesList = [];

    for(let i = 0; i < seatsPerRow.length; i++) {
        let names = namesPerRow[i].split(/\n/);
        let end = seatsPerRow[i] - names.length;
    
        for(let j = 0; j < end; j++) {
            names.push("");
        }

        namesList.push(names);
    }

    return namesList;
}

/**
 * Adds a row
 */
function addRow() {

    // Div for each row
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("flex");
    rowDiv.classList.add("flex-item");

    // Row text
    let rowText = document.createElement("p");

    numRows += 1;
    rowText.innerText = "Row " +numRows;

    textarea = document.createElement("textarea");
    textarea.rows = 20;
    textarea.cols = 25;
    textarea.placeholder = "FirstName1 LastName1\nFirstName2 LastName2\netc...";
    textarea.addEventListener("change", () => { createChart() });

    // Input for the # of seats
    let seatInput = document.createElement("input");
    seatInput.setAttribute("type", "text");
    seatInput.defaultValue = "0";

    seatInput.addEventListener("change", function() { createChart() });

    let newRow = new Row(rowText.innerText, seatInput, textarea);

    rowMap.set(rowText.innerText, newRow);

    // Edit row button
    let editRowButton = document.createElement("button");
    editRowButton.textContent = "Edit";

    editRowButton.addEventListener("click", function() { editRow(rowText.innerText) });

    // Remove row button
    let removeRowButton = document.createElement("button");
    removeRowButton.textContent = "X";

    rowDiv.appendChild(rowText);
    rowDiv.appendChild(seatInput);
    rowDiv.appendChild(editRowButton);
    rowDiv.appendChild(removeRowButton);

    removeRowButton.addEventListener("click", function() { removeRow(this.parentNode, rowText) });

    rowContainer.appendChild(rowDiv);

    createChart();
}

/**
 * Pulls up the corresponding name textbox for the correct row
 */
function editRow(rowTextInner) {
    editRowText.innerText = rowTextInner + " Names:";

    while (editContainer.firstChild) {
        editContainer.removeChild(editContainer.firstChild);
    }
    
    let nameBox = rowMap.get(rowTextInner).getTextArea();

    editContainer.appendChild(nameBox);
}

/**
 * Removes the corresponding row
 */
function removeRow(parentNode, rowText) {
    if(numRows > 1) {
        numRows -= 1;    

        parentNode.remove();

        rowMap.delete(rowText.innerText);
    
        renumberRows(rowText.innerText);
        createChart();
    }
}

/**
 * Renumbers the rows when a row is deleted so the row numbers are alwaus continous (e.g. 1, 2, 3, 4, etc.)
 * 
 * @param {String} startRow the row to start renumbering from (e.g. "Row 1")
 */
function renumberRows(startRow) {
    let allRowText = rowContainer.getElementsByTagName("p");

    let start = parseInt(startRow.slice(-1)) - 1;

    for(i = start; i < allRowText.length; i++) {
        let row = allRowText[i];
        row.innerText = "Row " +(i+1);
    }

    // Create a new rowMap retaining the same textareas
    let newRowMap = new Map();

    let count = 1;
    for (const value of rowMap.values()) {
        let key = "Row " +count;
        value.setRowNum(key);

        newRowMap.set(key, value);
        count += 1;
    }

    rowMap = newRowMap;
}

const form = document.getElementById("myForm");
const file = document.getElementById("myFile");

form.addEventListener("change", e => {
    e.preventDefault();

    let reader = new FileReader();

    reader.onload = function() {
        let fileContent = JSON.parse(reader.result);
        loadJSON(fileContent);
    };
    reader.readAsText(file.files[0]);
});

function loadJSON(json) {
    chartTitle.value = json["Chart Title"];
    showPodium.checked = json["Show Podium"];
    flipChart.checked = json["Flip Chart"];

    resetRows();

    for(let row of json["Rows"]) {
        rowNum = row["rowNum"];

        if(!(rowNum in rowMap)) {
            addRow();
        }

        rowNum = row["rowNum"];
        rowObj = rowMap.get(rowNum);
        
        rowObj.getSeatInput().value = row["numSeats"];
        rowObj.getTextArea().value = row["names"];
    }

    editRow("Row 1");
    createChart();
}

function resetRows() {
    numRows = 0;

    for(let key of rowMap.keys()) {
        rowMap.delete(key);
    }

    while (rowContainer.firstChild) {
        rowContainer.removeChild(rowContainer.firstChild);
    }

    while (editContainer.firstChild) {
        editContainer.removeChild(editContainer.firstChild);
    }
}

/**
 * To be called when the site is first loaded/reloaded
 */
function main() {
    addRow();
    editRow("Row 1");
}

main();