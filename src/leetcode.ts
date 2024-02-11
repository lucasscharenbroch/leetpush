import { get_active_tab } from './tabs'

const leetcode_url = "https://leetcode.com/problems/"

export async function active_tab_is_leetcode(): Promise<boolean> {
    return get_active_tab().then(t => {
        return t.url.startsWith(leetcode_url) &&
               t.url.length > leetcode_url.length;
    });
}

async function active_tab_exec<T>(f: () => Promise<T>): Promise<T> {

    async function inject_script(tab: chrome.tabs.Tab): Promise<T> {
        let scripting_injection = {
            target: {tabId: tab.id},
            func: f,
            world: "MAIN" as chrome.scripting.ExecutionWorld
        };

        let res = await chrome.scripting.executeScript(scripting_injection).then(x => x[0].result);

        if(chrome.runtime.lastError) {
            throw new Error("Error in script injection: " + chrome.runtime.lastError.message);
        }

        return res;
    }

    return get_active_tab().then(inject_script);
}

async function _get_title(): Promise<string> {
    return document.querySelector("[data-cy=question-title]").innerHTML;
}

async function _get_lang(): Promise<string> {
    return document.querySelector("[data-cy=lang-select] > div > .ant-select-selection-selected-value").innerHTML;
}

interface CodeMirrorDiv extends HTMLElement {
    CodeMirror : {getValue: () => string};
};

async function _get_code(): Promise<string> {
    let sel = "div.CodeMirror.cm-s-textmate.CodeMirror-wrap.cm-fat-cursor";
    return (document.querySelector(sel) as CodeMirrorDiv).CodeMirror.getValue();
}

export async function get_leetcode_problem_data(): Promise<{title: string,
                                                            lang: string,
                                                            code: string}> {

    let title = await active_tab_exec(_get_title);
    let lang = await active_tab_exec(_get_lang);
    let code = await active_tab_exec(_get_code);

    let res = {
        title: title = await active_tab_exec(_get_title),
        lang: lang = await active_tab_exec(_get_lang),
        code: await active_tab_exec(_get_code)
    }

    if(!title || !lang || !code) {
        throw Error("Incomplete leetcode information : ", res);
    }

    return res;
}
