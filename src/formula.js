// when you will click somewhere else in UI after adding value in cell. This will be called by itself.
// as you have added eventlistener on blur. this will update value in DB as well.

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let currCellProp = sheetDB[i][j];
      let enteredData = cell.innerText;
      if (enteredData == currCellProp.value ){
        return ;
      }
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
formulaBar.addEventListener("keydown", async(e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    // we need to remove existing parent child relnship first as well . and the establish the new one.
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (cellProp.formula !== inputFormula) {
      removeChildFromParent(cellProp.formula);
    }

    // add the children into the parent cells of graphComponentMatrix 
    addChildToGraphComponent(inputFormula,address);   // do this before evaluation else will be in stackoverflow condition if the cycle exists . 

    // check the formula is cyclic or not. If not cyclic then only evaluate.
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if(cycleResponse){
      let response = confirm("Your formula is cyclic, Do you want to trace your path??");
      while(response===true){
        // keep on tracing the path, until your user is satisfied.
        await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
        response = confirm("Your formula is cyclic, Do you want to trace your path??");
      }
      // let's say your formula is cyclic .But you have added those children to your parent in graphComponentMatrix . So you need to remove them as well.
      removeChildFromGraphComponent(inputFormula,address);
      return;
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

function addChildToGraphComponent(formula,childAddress){
  let encodedFormula = formula.split(" ");
  // child row and col.
  let [crid,ccid] = decodeRowAndColFromAddress(childAddress);
  for(let i = 0; i< encodedFormula.length;i++){
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue>=65 && asciiValue<=90){
      let [prid,pcid] = decodeRowAndColFromAddress(encodedFormula[i]);

      // so now we have parent row and col & child col and row. 
      // so now add child in parentcell of graphComponent . So we are storing crid and ccid in an array
      // then pushing that array in the array of parent (graphComponentMatrix[prid][crid]).
      // so for ex the graphComponentMatrix[0][0] (A1) will have somethign like this - [[1,2],[4,11],[2,4]..]
      graphComponentMatrix[prid][pcid].push([crid,ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula,childAddress){
  let encodedFormula = formula.split(" ");
  // child row and col.
  let [crid,ccid] = decodeRowAndColFromAddress(childAddress);
  for(let i = 0; i< encodedFormula.length;i++){
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue>=65 && asciiValue<=90){
      let [prid,pcid] = decodeRowAndColFromAddress(encodedFormula[i]);
      // now we can use pop to remove the last entry from the parent. Why last, bcoz we just added those chldren into parent.
      // so we can directly pop them.
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}
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
