let saveButton = document.getElementById("save")
let selectBox = document.getElementById("select-box")

saveButton.addEventListener("click", function() {
    let selected = selectBox.value

    switch(selected) {
        case "PNG":
            saveToPNG()
            break
        case "PDF":
            saveToPDF()
            break
        case "JSON":
            saveToJSON()
    }
})

/**
 * Saves the seating chart as a PNG
 */
function saveToPNG() {

}

/**
 * Saves the seating chart as a PDF
 */
function saveToPDF() {

}

/**
 * Saves the seating chart as a JSON
 */
function saveToJSON() {
    let rows = []

    for(let row of rowMap.values()) {
        curr_row = {
            rowNum: row.getRowNum(),
            numSeats: row.getNumSeats(),
            names: row.getNames()
        }
        rows.push(curr_row)
    }

    data = {
        "Chart Title": chartTitle.value,
        "Rows": rows
    }

    let jsonse = JSON.stringify(data, null, 2)
    let blob = new Blob([jsonse], {type: "application/json"})
    let url  = URL.createObjectURL(blob)

    fileName = chartTitle.value.replace(/\s\s+/g, "_")

    var a = document.getElementById("a-tag")
    a.href = url
    a.download = fileName+".json"
    a.textContent = "Download " + a.download

    document.getElementById('json').appendChild(a)
}
    
