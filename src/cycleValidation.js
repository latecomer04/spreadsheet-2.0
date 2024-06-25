
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
function isGraphCyclic(graphComponentMatrix){
    // dependency - visited , dfsvisited
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


    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(visited[i][j]===false){
                let response = dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
                if(response===true) return true;     // if response true, then cycle exists so return true.
            }
        }
    }
    return false;
}

// start -> visited[r][c] = true, dfsVisited[r][c] = true;
// end -> dfsVisited[r][c] = false;
// if visited[r][c] == true -> then it is already explored path, so no need to explore it again.
// condition of cycle -> if(visited[r][c] == true && dfsVisited[r][c]==true) then it is a cycle.
// this function will return true if cycle exists else return false. 
// srcc = sourceColumn and scrr = sourceRow.
function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited) {
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;

    // children will be stred like this , for eg For cell A1 = [[1,2],[4,11],[2,4]..]
    for(let children=0;children<graphComponentMatrix[srcr][srcc].length;children++){
        // extract neighbourRow and neighbourCol
        let [nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];
        //if already visited path , then no need to explore 
        if(visited[nbrr][nbrc]===false){
            let response = dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response==true)return true;     // found cycle  , so return immediately, no need to explore further.
        }
        else if(visited[nbrr][nbrc]===true && dfsVisited[nbrr][nbrc]===true){
            return true;        // when both conditions are true then it means cycle exists.
        }
    }
    
    // mark dfsVisited[srcr][srcc] false;
    dfsVisited[srcr][srcc]=false;
    return false;
}