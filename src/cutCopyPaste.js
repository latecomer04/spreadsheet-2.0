let ctrlKey;
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");
// Return Value:	A Boolean.
// Returns true if the CTRL key was pressed when a mouse event occurs.
// Otherwise it returns false.
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
})

document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
})

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

// to store the co-ordinates of the selected cells.
let rangeStorage = [];
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      // reset the border for the selected cells , if already 2 cells are in range storage.
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    // UI
    cell.style.border = "3px solid #218c74"

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
  })
}

function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
    cell.style.border = "1px solid #dfe4ea";
  }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  // clear the data from previous copy..
  copyData = [];
  let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];


  for (let i = startRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = startCol; j <= endCol; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }
  console.log("copy button clicked");
  console.log(copyData);
  // making the cells border as they should be in normal state.
  defaultSelectedCellsUI();

})


pasteBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;


  // no. of rows from which the data is being copied.
  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  let address = addressBar.value;
  let [stRow, stCol] = decodeRowAndColFromAddress(address);

  for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell || r >= copyData.length || c >= copyData[r].length) continue;
      // update the data in DB
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;
      // updata in UI
      cell.click();
    }
  }

})

cutBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;

  let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // DB
      let cellProp = sheetDB[i][j];
      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGcolor = "#000000";
      cellProp.alignment = "left";

      // UI
      cell.click();
    }
  }
  defaultSelectedCellsUI();

})