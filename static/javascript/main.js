let numRows = 1;

let rowContainer = document.getElementById("row-container");
let addRowButton = document.getElementById("add-row");

console.log(addRowButton);

addRowButton.addEventListener("click", function() {
    var rowDiv = document.createElement("div");
    rowDiv.classList.add("flex");

    var rowText = document.createElement("p");
    rowText.classList.add("paragraph-styling");
    
    var removeRowButton = document.createElement("button");
    removeRowButton.textContent = "X";

    rowDiv.appendChild(rowText);
    rowDiv.appendChild(removeRowButton);

    rowText.innerText = "Row " +numRows;
    numRows += 1;

    rowContainer.appendChild(rowDiv);
});