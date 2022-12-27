let saveButton = document.getElementById("save");
let selectBox = document.getElementById("select-box");

saveButton.addEventListener("click", function() {
    let selected = selectBox.value;

    switch(selected) {
        case "PNG":
            saveToPNG();
            break
        case "JPEG":
            saveToJPEG();
            break
        case "JSON":
            saveToJSON();
    }
})

/**
 * Saves the seating chart as a PNG
 */
function saveToPNG() {
    downloadChart(getFileName(chartTitle.value), "png");
}

/**
 * Saves the seating chart as a PDF
 */
function saveToJPEG() {
    downloadChart(getFileName(chartTitle.value), "jpeg");
}

/**
 * Saves the seating chart as a JSON
 */
function saveToJSON() {
    let rows = [];

    for(let row of rowMap.values()) {
        curr_row = {
            rowNum: row.getRowNum(),
            numSeats: row.getNumSeats(),
            names: row.getNames()
        }
        rows.push(curr_row);
    }

    data = {
        "Chart Title": chartTitle.value,
        "Show Podium": showPodium.checked,
        "Flip Chart": flipChart.checked,
        "Rows": rows
    }

    let jsonse = JSON.stringify(data, null, 2);
    let blob = new Blob([jsonse], {type: "application/json"});
    let url  = URL.createObjectURL(blob);

    let fileName = getFileName(chartTitle.value);

    var a = document.getElementById("a-tag");
    a.href = url;
    a.download = fileName+".json";

    a.click();
    URL.revokeObjectURL(blobUrl)
}

function getFileName(fileName) {
    return fileName.split(" ").join("_");
}    
