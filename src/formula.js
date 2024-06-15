

// when you will click somewhere else in UI after adding value in cell. This will be called by itself.
// as you have added eventlistener on blur. this will update value in DB as well.

for(let i = 0; i< rows;i++){
    for(let j = 0;j<cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let currCellProp = sheetDB[i][j];
            let enteredData = cell.innerText;
            currCellProp.value = enteredData;
        })
    }
}

// get expression from formula bar. so have formula container first.
formulaBar.addEventListener("keydown",(e)=>{
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){
        let evaluatedValue = evaluateFormula(inputFormula);
        setCellUIAndCellProp(evaluatedValue,inputFormula);
    }
})

function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");        // array -> [A0," ",B1," ",10];
    for( let i = 0 ; i<encodedFormula.length ;i++){
        let e = encodedFormula[i];
        let asciiValue = e.charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [cell,cellProp] = getCellAndCellProp(e);  
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue,formula) {
    //find active cell and the corresponding cellProp
    [cell,cellProp] = getCellAndCellProp(addressBar.value);
    cell.innerText = evaluatedValue;       // UI change.
    // DB change.
    cellProp.formula = formula;
    cellProp.value = evaluatedValue;
}