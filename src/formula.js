// when you will click somewhere else in UI after adding value in cell. This will be called by itself.
// as you have added eventlistener on blur. this will update value in DB as well.

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let currCellProp = sheetDB[i][j];
      let enteredData = cell.innerText;

      if (enteredData === currCellProp.value) return;
      //update the new value.
      currCellProp.value = enteredData;

      // now if you have manually entered any value. then firstly remove all the relnships with the parent.
      removeChildFromParent(currCellProp.formula);
      //  make formula empty as this cell value are not derived from formula.
      currCellProp.formula = "";
      // now update the children
      updateChildrenCells(addressBar.value);
    });
  }
}

// get expression from formula bar. so have formula container first.
formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    // we need to remove existing parent child relnship first as well . and the establish the new one.
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (cellProp.formula !== inputFormula) {
      removeChildFromParent(cellProp.formula);
    }

    let evaluatedValue = evaluateFormula(inputFormula);
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    // now add this cell address to the parent cellProp as it is depending upon some parent cell
    // eg - A1+10 -> then add this cell in the cellProp of A1.
    addChildToParent(inputFormula);
    // now update the children cells as well in case you change formula for any cell. in parameter we are passing the parent address.
    // which will be used to find children of that cell.
    updateChildrenCells(address);
  }
});

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" "); // array -> [A0," ",B1," ",10];
  for (let i = 0; i < encodedFormula.length; i++) {
    let e = encodedFormula[i];
    let asciiValue = e.charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(e);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  //find active cell and the corresponding cellProp
  [cell, cellProp] = getCellAndCellProp(address);
  cell.innerText = evaluatedValue; // UI change.
  // DB change.
  cellProp.formula = formula;
  cellProp.value = evaluatedValue;
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0); // if A1+10 -> then find ascii of A
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]); // [A1," ",10] , then addres is A1
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  // use the formula stored in the cell prop to remove the old p-c relnship.
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);

    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}
