import Popup from './Popup.svelte';
import { hello_github } from "./github";

const app = new Popup({
    target: document.body,
    props: {
        name: 'world',
        f: hello_github,
    }
});

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


getCurrentTab().then(t =>
    chrome.scripting.executeScript({
            target: {tabId: t.id},
            func: () => console.log("hi from extension"),
    }));

export default app;
