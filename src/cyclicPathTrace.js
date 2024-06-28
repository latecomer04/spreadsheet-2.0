
// for delay and wait
function colorPromise(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },1000);
    })
}


// return true -> if cyclic , return false-> if nonCyclic.
async function isGraphCyclicTracePath(graphComponentMatrix,cycleResponse){
    // dependency - visited , dfsvisited
    let [srcr,srcc]=cycleResponse;
    let visited = [];   // to track which cells are visite
    let dfsVisited = [];    // to track the dfs stack trace . 

    for(let i=0;i<rows;i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited);
    if(response===true)return Promise.resolve(true);
    return Promise.resolve(false);
}
 

// coloring cells for cycle path.
async function dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited) {
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;
    let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();
 
    // children will be stred like this , for eg For cell A1 = [[1,2],[4,11],[2,4]..]
    for(let children=0;children<graphComponentMatrix[srcr][srcc].length;children++){
        // extract neighbourRow and neighbourCol
        let [nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];
        //if already visited path , then no need to explore 
        if(visited[nbrr][nbrc]===false){
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response===true){
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }     // found cycle  , so return immediately, no need to explore further.
        }
        else if(visited[nbrr][nbrc]===true && dfsVisited[nbrr][nbrc]===true){
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);
            
            cyclicCell.style.backgroundColor = "green";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);        // when both conditions are true then it means cycle exists.
        }
    }
    
    // mark dfsVisited[srcr][srcc] false;
    dfsVisited[srcr][srcc]=false;
    return Promise.resolve(false);
}