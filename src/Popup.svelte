<script lang="ts">
    import { writable } from 'svelte/store';
    import { active_tab_is_leetcode, get_leetcode_problem_info } from "./leetcode";
    import { file_exists as github_file_exists } from './github';

	let is_leetcode = false;

	active_tab_is_leetcode().then(x => is_leetcode = x);

	let success_scraping_info = writable(false);
	let problem_info;
	let scraping_err;

	async function try_scrape() {
		try {
			await get_leetcode_problem_info().then(x => {
				success_scraping_info.set(true);
				problem_info = x;
			});
		} catch(err) {
			console.log("scraping err");
			scraping_err = err;
		}
	}

	try_scrape()

	let owner = "owner"; // TODO
	let repo = "repo"; // TODO
	let file_name = "test_file.txt";

	let file_exists = writable(false);

	$: github_file_exists(file_name).then(x => file_exists.set(x))
</script>

<main>
	<h1>Leetpush</h1>

	{#if !is_leetcode}
		<h3>Active tab is not Leetcode.</h3>
	{:else if !$success_scraping_info}
		{#if !scraping_err}
			<h3>Scraping problem info...</h3>
		{:else}
			<h3 class="red">Error scraping problem info:</h3>
			<p>{scraping_err}</p>
		{/if}
	{:else}
		<h3>Leetcode.</h3>
		<label for="file-name">File Name</label>
		<input type="text" id="file-name" name="file-name" bind:value={file_name} />

		<p>{JSON.stringify(problem_info)}</p>
		{#if $file_exists}
			<p class="red">The file {file_name} already exists in {owner}/{repo}</p>
		{/if}
	{/if}

</main>

<style>
	main {
		text-align: center;
		padding: 0.1em;
		max-width: 540px;
	}

	h1 {
		font-size: 2em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.red {
		color: red;
	}
</style>
