import App from './App.svelte';
import { hello_github } from "./github";

const app = new App({
    target: document.body,
    props: {
        name: 'world',
        f: hello_github,
    }
});

export default app;
