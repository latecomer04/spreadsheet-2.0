
// storage for storing children data
let graphComponentMatrix = [];
for(let i = 0;i<rows;i++){
    let row = [];
    for(let j = 0;j<cols;j++){
        // why push an array ? bcoz we need to store the children of a node and there can be multiple children
        // so to store multiple entries, we are using array.
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

// return true -> if cyclic , return false-> if nonCyclic.
function isGraphCyclic(){

}