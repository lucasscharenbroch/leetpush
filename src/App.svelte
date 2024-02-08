<script lang="ts">
	export let name: string;
	export let f: function(): Promise<string>;

	let p_contents: string = "";

	async function show_f() {
		let x = await f();
		console.log("got ", x);
		p_contents = x;
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>{p_contents}</p>
	<button on:click={show_f}>click me</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
