import { optNames } from './option-names'

function save() {
    let saveObj = {};
    for(const opt of optNames) {
        saveObj[opt] = (document.getElementById(opt) as HTMLInputElement).value;
    }

    chrome.storage.sync.set(saveObj) .then(() =>  {
        document.getElementById("status").innerHTML = "Successfully Saved";
    });
}

async function populate() {
    let optVals = await chrome.storage.sync.get(optNames);
    for(const opt of optNames) {
        if(optVals[opt]) {
            (document.getElementById(opt) as HTMLInputElement).value = optVals[opt];
        }
    }
}

document.getElementById("saveButton").onclick = save;
populate();

export {};
