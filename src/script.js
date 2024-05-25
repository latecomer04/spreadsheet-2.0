let rows=100;
let cols=26;

//now we will insert 100 rows number divs in the vertical col below the dummy cell
let addressColCont = document.querySelector(".address-col-cont");
for(let i=0;i<rows;i++){
    // now we will create a div that will contain the row number
    let addressCol = document.createElement("div");
    addressCol.innerText = i+1;
    addressCol.setAttribute("class","address-col");
    addressColCont.appendChild(addressCol);
}

//same for top row to contain the col no
let addressRowCont = document.querySelector(".address-row-cont");
for(let i=0;i<cols;i++){
    let addressRow = document.createElement("div");
    addressRow.innerText = String.fromCharCode(65+i);
    addressRow.setAttribute("class","address-row");
    addressRowCont.appendChild(addressRow);
}