import Popup from './Popup.svelte';
import { hello_github } from "./github";
import { active_tab_is_leetcode, get_leetcode_problem_data } from './leetcode';

const app = new Popup({
    target: document.body,
    props: {
        name: 'world',
        f: hello_github,
    }
});

active_tab_is_leetcode().then(b => {
    if(b) {
        (async function() {
            await get_leetcode_problem_data().then(x => console.log(JSON.stringify(x)));
        })()
    }else {
        console.log("not leetcode");
    }
});

export default app;
