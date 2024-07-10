
// for delay and wait
// this will return promise. after 1000ms that promise will be resoved.
// if a function is returning promise then it should be async.
async function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}


// SetTimeOut is a async method. so the program execution will not stop for this. 
// to make that synchronous, we are using here async await .    
// if a function is async then it shows that this function is handling some async property
// you have to use await keyword whenever you are calling promise. because you want to wait until that promise is resolved.
async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    // dependency - visited , dfsvisited
    let [srcr, srcc] = cycleResponse;
    let visited = [];   // to track which cells are visite
    let dfsVisited = [];    // to track the dfs stack trace . 

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    // as this function is returning promise, then to handle promise you have to use await. 
    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited);
    if (response === true) return Promise.resolve(true);
    return Promise.resolve(false);
}


// coloring cells for cycle path.
// as you have use await and this function is also return promise so use async .
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;
    let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

    cell.style.backgroundColor = "lightblue";
    // wait till the resolution of promise.
    await colorPromise();

    // children will be stred like this , for eg For cell A1 = [[1,2],[4,11],[2,4]..]
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        // extract neighbourRow and neighbourCol
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        //if already visited path , then no need to explore 
        if (visited[nbrr][nbrc] === false) {
            // using await for the promise resolution as dfsCycleDetectionTracePath is returing promise.
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {
                cell.style.backgroundColor = "transparent";
                // here as it is waiting to resolve promise , so you have to use await keyword.
                await colorPromise();
                return Promise.resolve(true);
            }     // found cycle  , so return immediately, no need to explore further.
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);

            cyclicCell.style.backgroundColor = "green";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);        // when both conditions are true then it means cycle exists. so return true in promise.
        }
    }

    // mark dfsVisited[srcr][srcc] false;
    dfsVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}