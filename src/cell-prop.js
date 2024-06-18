let sheetDB = [];

//an interesting thing -> see we have not defined rows , cols var here. but we are using them. how?
//<script src="./grid.js"></script>
//<script src="./cell-prop.js"></script>
// in index.html we have added our js files like this. so grid is mentioned before cell-prop. So all the data of grid will be accessible in cell-prop

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

//find all selectors;
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centreAlign = alignment[1];
let rightAlign = alignment[2];
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let formulaBar = document.querySelector(".formula-bar");

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// ----------------------------------attach property listeners-----------------------------------------

// for bold
bold.addEventListener("click", () => {
  let addressValue = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(addressValue);

  //modification
  cellProp.bold = !cellProp.bold; //data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //make bold or normal
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp; //make bold icon active or inactive.
});

// for italic
italic.addEventListener("click", () => {
  let addressValue = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(addressValue);

  // modification
  cellProp.italic = !cellProp.italic; // data change in DB
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // make change in UI
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp; // make change in UI
});

// for underline
underline.addEventListener("click", () => {
  let [cell, cellProp] = getCellAndCellProp(addressBar.value);
  cellProp.underline = !cellProp.underline; // data change in DB
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // change on UI
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp; // make change in UI
});

// for fontSize
fontSize.addEventListener("change", () => {
  let [cell, cellProp] = getCellAndCellProp(addressBar.value);
  cellProp.fontSize = fontSize.value; // data change
  cell.style.fontSize = cellProp.fontSize + "px"; // change on UI
  fontSize.value = cellProp.fontSize;
});

// for fontFamily  -> on input tags we use "change" rather than "click"
fontFamily.addEventListener("change", () => {
  let [cell, cellProp] = getCellAndCellProp(addressBar.value);
  cellProp.fontFamily = fontFamily.value; // data change in db
  cell.style.fontFamily = cellProp.fontFamily; // change on UI
  fontFamily.value = cellProp.fontFamily;
});

// for fontColor -> on input tags , "change" is used not "click"
fontColor.addEventListener("change", () => {
  let [cell, cellProp] = getCellAndCellProp(addressBar.value);
  cellProp.fontColor = fontColor.value; // make change in db
  cell.style.color = cellProp.fontColor; // change on UI
  fontColor.value = cellProp.fontColor;
});

// for background color.
bgColor.addEventListener("change", () => {
  let [cell, cellProp] = getCellAndCellProp(addressBar.value);
  cellProp.BGcolor = bgColor.value; // data change
  cell.style.backgroundColor = cellProp.BGcolor; // change on UI
  bgColor.value = cellProp.BGcolor;
});

// for alignment;
alignment.forEach((alignElement) => {
  alignElement.addEventListener("click", (e) => {
    let alignValue = e.target.classList[0];
    let [cell, cellProp] = getCellAndCellProp(addressBar.value);
    cellProp.alignment = alignValue; // change in Data;
    cell.style.textAlign = cellProp.alignment; // UI change(1);

    switch (
      alignValue // UI change(2) for changing background color of active prop.
    ) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centreAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centreAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centreAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

// re-bind properties of cell when you click on any cell.
let allCells = document.querySelectorAll(".cell");
allCells.forEach((currCell) => {
  addListenerToAttachCellProperties(currCell);
});

function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", () => {
    let [rid, cid] = decodeRowAndColFromAddress(addressBar.value);
    currCellProp = sheetDB[rid][cid];

    // so we have now the prop for the currCell in currCellProp , now make changes for the cell.
    cell.style.fontWeight = currCellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = currCellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = currCellProp.underline ? "underline" : "none";
    cell.style.fontFamily = currCellProp.fontFamily;
    cell.style.fontSize = currCellProp.fontSize + "px";
    cell.style.fontColor = currCellProp.fontColor;
    cell.style.backgroundColor =
      currCellProp.BGcolor === "#000000" ? "transparent" : currCellProp.BGcolor;
    cell.style.alignElement = currCellProp.alignment;
    // here we are making changes to props icon. like bold, italics, underline etc.
    // alignment.
    switch (currCellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centreAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centreAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centreAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
    fontFamily.value = currCellProp.fontFamily; // fontFamily
    fontSize.value = currCellProp.fontSize; //fontSize
    bold.style.backgroundColor = currCellProp.bold
      ? activeColorProp
      : inactiveColorProp; //bold
    italic.style.backgroundColor = currCellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = currCellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontColor.value = currCellProp.fontColor;
    bgColor.value = currCellProp.BGcolor;
    formulaBar.value = currCellProp.formula;
    cell.value = currCellProp.value;
  });
}

// find active cell
function getCellAndCellProp(address) {
  // address will be in the form of row - col
  [rowId, colId] = decodeRowAndColFromAddress(address);

  // find cell using selectors
  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);
  // find cell prop for the cell from sheet DB.
  let cellProp = sheetDB[rowId][colId];

  //cell will be used to make changes on UI and cellprop for data about that cell.
  //so inshorts two way binding.
  return [cell, cellProp];
}

function decodeRowAndColFromAddress(address) {
  // let address -> 11C , C11
  let rowId = Number(address.slice(1, address.length)) - 1;
  let colId = Number(address.charCodeAt(0)) - 65;
  console.log("row " + rowId + " col " + colId);
  return [rowId, colId];
}
