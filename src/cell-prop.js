let sheetDB = [];

//an interesting thing -> see we have not defined rows , cols var here. but we are using them. how?
//<script src="./grid.js"></script>
//<script src="./cell-prop.js"></script>
// in index.html we have added our js files like this. so grid is mentioned before cell-prop. So all the data of grid will be accessible in cell-prop



for(let i=0;i<rows;i++){
    let sheetRow = [];
    for(let j=0;j<cols;j++){
        let cellProp = {
            bold:false,
            italic : false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize : "14",
            fontColor: "#000000",
            BGcolor: "#000000"      // just for indication.
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}


//find all selectors;
let bold=document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centreAlign = alignment[1];
let rightAlign = alignment[2];
let fontFamily = document.querySelector(".font-family-prop");
let fontSize =  document.querySelector(".font-size-prop");
let fontColor  = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";


//attach property listeners.

bold.addEventListener("click",(e)=>{
    let addressValue = addressBar.value;
    let [cell,cellProp]  = findActiveCell(addressValue);

    //modification 
    cellProp.bold = !cellProp.bold;  //data change
    cell.style.fontWeight = cellProp.bold?"bold":"normal"; //make bold or normal
    bold.style.backgroundColor = cellProp.bold?activeColorProp:inactiveColorProp;  //make bold icon active or inactive.
})

// find active cell
function findActiveCell(address){

    // address will be in the form of row - col
    [rowId,colId] = decodeRowAndColFromAddress(address);
    // find cell
    let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);
    let cellProp = sheetDB[rowId][colId];

    //cell will be used to make changes on UI and cellprop for data about that cell.
    //so inshorts two way binding.
    return [cell,cellProp];
}

function decodeRowAndColFromAddress(address){
    // let address -> 11C
    let rowId = Number(address.slice(0,address.length-1))-1;
    let colId = Number(address.charCodeAt(address.length-1))-65;
    return [rowId,colId]; 
}