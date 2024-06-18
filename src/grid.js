let rows = 100;
let cols = 26;

let addressRowCont = document.querySelector(".address-row-cont");
let addressColCont = document.querySelector(".address-col-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

//now we will insert 100 rows number divs in the vertical col below the dummy cell
for (let i = 0; i < rows; i++) {
  // now we will create a div that will contain the row number
  let addressCol = document.createElement("div");
  addressCol.innerText = i + 1;
  addressCol.setAttribute("class", "address-col");
  addressColCont.appendChild(addressCol);
}

//same for top row to contain the col no
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRow.setAttribute("class", "address-row");
  addressRowCont.appendChild(addressRow);
}

//make main grid here
for (let i = 0; i < rows; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-cont");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", true);

    //for making a connection between row and col of cell and that will be used for binding with the cell props.
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);
    cell.setAttribute("spellcheck", false);
    addListenerForAddressBar(cell, i, j);
    rowCont.appendChild(cell);
  }
  cellsCont.appendChild(rowCont);
}

function addListenerForAddressBar(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowId = i + 1;
    let colId = String.fromCharCode(65 + j);
    addressBar.value = `${colId}${rowId}`;
  });
}

// by default click the first row and col [0,0]. So all cells have cell class.
// document.querySelector() will give the first one that matches . that will be [0,0].
// so use this to click that by default
let firstCell = document.querySelector(".cell");
firstCell.click();
