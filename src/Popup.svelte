<script lang="ts">
	export let name: string;
	export let f: () => Promise<string>;

	let p_contents: string = "";

	async function show_f() {
		let x = await f();
		console.log("got ", x);
		p_contents = x;
	}
</script>

<main>
	<h1>Leetpush</h1>
	<p>{p_contents}</p>
	<button on:click={show_f}>click me</button>
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
</style>
