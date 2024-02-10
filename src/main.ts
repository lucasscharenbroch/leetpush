import Popup from './Popup.svelte';
import { hello_github } from "./github";

const app = new Popup({
    target: document.body,
    props: {
        name: 'world',
        f: hello_github,
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    let f = () => {
        console.log("hi");
        window.requestAnimationFrame(f);
    }

    f();
    // document.querySelector(".btn__r7r7").click();
});

export default app;
