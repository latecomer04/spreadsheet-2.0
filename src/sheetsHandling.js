let addSheetBtn = document.querySelector(".sheet-add-icon");
let sheetFolderCont = document.querySelector(".sheets-folder-cont");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    let noOfSheets = document.querySelectorAll(".sheet-folder").length;
    sheet.setAttribute("class", "sheet-folder");
    sheet.setAttribute("id", noOfSheets);
    sheet.innerHTML = `<div class="sheet-content">Sheet ${noOfSheets + 1}</div>`;
    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // left click is represented by 0 , middle wheel click -> 1 and right click ->2
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You have to have atleast 1 sheet, you can't remove it");
            return;
        }

        let response = confirm("Do you really want to remove the sheet permanently?");
        if (response === false) return;

        // DB change.
        let sheetIdx = Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);

        // make changes on UI
        handleSheetRemovalUI(sheet);

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetRemovalUI(sheet) {
    // If you have a div element and you use .remove() on it, 
    // that div will be taken away from the page and will not be displayed anymore.
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];

}

// click on every cell once you are adding new sheet so that every property of cell should pick from newsheet.
function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // by default click the first row and col [0,0]. So all cells have cell class.
    // document.querySelector() will give the first one that matches . that will be [0,0].
    // so use this to click that by default
    let firstCell = document.querySelector(".cell");
    firstCell.click();

}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "gray";
}
// whenever you'll click on any sheet. , to handle that adding event listener.
function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        console.log("sheetDB " + sheetDB[0][0].alignment);
        handleSheetProperties();
        handleSheetUI(sheet);

    })
}

// whenever a new sheet is added to sheetfolder , add a new sheetDB in collectedSheetDB.
function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000", // just for indication.
                value: "",
                formula: "",
                children: [],
            };
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

// when a new sheet is added or created , you need to have a new graph component matrix as well.
function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // why push an array ? bcoz we need to store the children of a node and there can be multiple children
            // so to store multiple entries, we are using array.
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}
