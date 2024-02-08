import Popup from './Popup.svelte';
import { hello_github } from "./github";

const app = new Popup({
    target: document.body,
    props: {
        name: 'world',
        f: hello_github,
    }
});

export default app;
