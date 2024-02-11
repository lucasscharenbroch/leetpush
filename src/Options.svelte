<script lang="ts">
    import { opt_names, opt_labels } from './option-names'

    function save() {
        let saveObj = {};
        for(const opt of opt_names) {
            saveObj[opt] = (document.getElementById(opt) as HTMLInputElement).value;
        }

        chrome.storage.sync.set(saveObj).then(() =>  {
            document.getElementById("status").innerHTML = "Successfully Saved";
        });
    }

    async function populate() {
        let optVals = await chrome.storage.sync.get(opt_names);
        for(const opt of opt_names) {
            if(optVals[opt]) {
                (document.getElementById(opt) as HTMLInputElement).value = optVals[opt];
            }
        }
    }

    populate();

    let name_labels = [];
    for(let i = 0; i < opt_names.length; i++) {
        name_labels.push([opt_names[i], opt_labels[i]]);
    }
</script>

<main>
    <h1>Options</h1>

    {#each name_labels as nl}
        <div>
            <label for={nl[0]}>{nl[1]}</label>
            <input type="text" id={nl[0]} name={nl[0]}/>
        </div>
    {/each}

    <button id="saveButton" on:click={save}>Save</button>

    <p id="status"></p>
</main>

<style>
    div {
        display: block;
        margin: 1% 0;
    }

    label, p {
        font-size: 1.5em;
    }
</style>
