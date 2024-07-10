let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], {
        type: "application/json"
    });

    let a = document.createElement("a");
    // create a temp url to blob.
    a.href = URL.createObjectURL(file);
    //The HTMLAnchorElement.download property is a string 
    // indicating that the linked resource is intended to be downloaded rather than displayed in the browser.
    a.download = "sheetData.json"
    a.click();
})


// open new sheet
openBtn.addEventListener("click", (e) => {
    //open the file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");      // type : file, is responsible for opening the file explorer.
    input.click();

    // when you will choose a file, then change event will occur as it's value will be changed
    input.addEventListener("change", (e) => {

        let files = input.files;        // input.files returns a fileList obj on a filetype input obj.
        let fileObj = files[0];

        // now read the file using filereader.
        let fr = new FileReader();
        fr.readAsText(fileObj);
        // The "load" event is triggered when the file has been successfully read
        fr.addEventListener("load", (e) => {
            let readJsonData = JSON.parse(fr.result)    // fr.result -  contains the result of the file read operation.
            // or stores the content of file

            // now you have the content of the sheet. now click the add button to add new sheet
            addSheetBtn.click();
            //assign this data to sheetDB and graphComponent Matrix , so that you can show this data on UI.
            sheetDB = readJsonData[0];
            graphComponentMatrix = readJsonData[1];

            // now update the databas
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphComponentMatrix;

            // click on every cell to update properties in UI
            handleSheetProperties();
        })
    })
})