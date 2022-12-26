let saveButton = document.getElementById("save")
let selectBox = document.getElementById("select-box")

saveButton.addEventListener("click", function() {
    let selected = selectBox.value

    switch(selected) {
        case "PNG":
            // code block
            break;
        case "PDF":
            // code block
            break;
        case "JSON":
            saveToJSON()
    }
})

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
        "Chart Title": "UNNAMED",
        "Rows": rows
    }

    console.log(data)

    let jsonse = JSON.stringify(data, null, 2);
    let blob = new Blob([jsonse], {type: "application/json"});
    let url  = URL.createObjectURL(blob);

    var a = document.getElementById("a-tag");
    a.href = url;
    a.download = "seating_chart.json";
    a.textContent = "Download " + a.download;

    document.getElementById('json').appendChild(a);
}
    
