function f() {
    console.log("test");

    chrome.action.onClicked.addListener(async (tab) => {
        console.log("hi");
        (document.querySelector(".btn__r7r7") as HTMLButtonElement).click();
    });
}

export default f;