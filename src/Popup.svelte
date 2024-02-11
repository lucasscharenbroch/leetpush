<script lang="ts">
    import { writable } from 'svelte/store';
    import { active_tab_is_leetcode, get_leetcode_problem_info } from "./leetcode";
    import { file_exists as github_file_exists, make_commit as make_github_commit } from './github';
    import { get_options } from './storage';
	import { lang_to_extension } from './lang_extensions';

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
			scraping_err = err;
		}
	}

	try_scrape();

	let owner, repo, branch, file_name_pat, commit_pat;
	let file_name, file_url, commit_message;

	let code, nlines;

	get_options().then(x => {
		({ owner, repo, branch, file_name_pat, commit_pat } = x);
	}).then(() =>
		get_leetcode_problem_info().then(x => {
			let full_title = x.title;
			let lang = x.lang;
			code = x.code;
			nlines = code.split("\n").length;

			// possible variables to be used in formatting patterns
			let ext = lang_to_extension(lang);
			let [, number, Title] = full_title.match(/^([0-9]*)\. (.*)/);
			let number_padded = number.padStart(4, "0");
			let Title_ = Title.replace(/ /g, "_");
			let Title_dash = Title.replace(/ /g, "-");
			let title_ = Title_.toLowerCase();
			let title_dash = Title_dash.toLowerCase();
			let specs = { ext, number, number_padded, Title, Title_, Title_dash, title_, title_dash };

			function spec_lookup(_, x) {
				return specs[x];
			}

			let spec_pat = /{([^}]*)}/g;

			file_name = file_name_pat.replace(spec_pat, spec_lookup);
			file_url = `https://github.com/${owner}/${repo}/blob/${branch}/${file_name}`;

			specs = { ...specs, file_name };

			commit_message = commit_pat.replace(spec_pat, spec_lookup);
		})
	);

	let file_exists = writable(false);

	let misc_err = writable(undefined);

	async function update_file_existence(name: string): Promise<void> {
		try {
			await github_file_exists(name).then(x => file_exists.set(x));
		} catch(err) {
			misc_err.set(err.message);
		}
	}

	$: update_file_existence(file_name);

	let commit_url = writable(undefined);
	let loading = writable(false);

	async function make_commit() {
		loading.set(true);
		let code_ = code;
		if(!code_.endsWith("\n")) code_ += "\n";

		try {
			let commit_hash = await make_github_commit(file_name, code_, commit_message);
			await update_file_existence(file_name);
			commit_url.set(`https://github.com/${owner}/${repo}/commit/${commit_hash}`);
		} catch(err) {
			misc_err.set(err.message);
		}

		loading.set(false);
	}
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
	{:else if $misc_err}
		<h3 class="red">Error:</h3>
		<p class=red>{$misc_err}</p>
	{:else if $commit_url}
		<h3>Commit Successful</h3>
		<a href={$commit_url} target="_blank">{$commit_url}</a>
	{:else}
		<div>
			<label for="file-name">File Name</label>
			<input type="text" id="file-name" name="file-name" bind:value={file_name} />
		</div>

		<div>
			<label for="file-name">Commit Message</label>
			<input type="text" id="commit-message" name="commit-message" bind:value={commit_message} />
		</div>

		<p><b>{nlines}</b> lines to commit.</p>

		<button on:click={make_commit}>Commit</button>
		{#if $file_exists}
			<p class="red">The file <a href={file_url} target="_blank">{file_name}</a> already exists.</p>
		{/if}

		{#if $loading}
			<p>Loading...</p>
		{/if}
	{/if}

</main>

<style>
	main {
		text-align: center;
		padding: 0.1em;
		min-width: 150px;
		max-width: 350px;
	}

	div {
        display: block;
    }

	h1 {
		font-size: 2em;
	}

	p, a {
		word-wrap: break-word;
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
