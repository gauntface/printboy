<script context="module">
	import { browser, dev } from '$app/env';

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;
</script>

<script>
	import LabelImages from '../lib/settings/LabelImages.svelte';
	import LabelTitles from '../lib/settings/LabelTitles.svelte';

	export let labelPresets;

	async function submitAddress(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const addresses = data.getAll("address");
		for (const a of addresses) {
			try {
				await fetch(`/presets/add-address`, {
					method: 'POST',
					body: JSON.stringify({
						address: a,
					}),
				});
				window.location.reload();
			} catch (err) {
				console.error(`Failed to add address: `, err);
			}
		}
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="content">
	<h1>Settings</h1>

	<main>
	<section>
		<h2>Preset Images</h2>
		<LabelImages labelPresets={labelPresets}></LabelImages>
	</section>

	<section>
		<h2>Preset Titles</h2>
		<LabelTitles labelPresets={labelPresets}></LabelTitles>
	</section>

	<section>
		<h2>Preset addresses</h2>

		<ul class="l-labelimages">
			{#each labelPresets.addresses as addr}
				<li><pre>{addr}</pre></li>
			{/each}
		</ul>

		<h3>Add new address</h3>

		<form method="post" on:submit={submitAddress}>
			<textarea rows=7 cols=80 name="address"></textarea>
			<button type="submit">Add address</button>
		</form>
	</section>
	</main>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 64px;
	}
</style>
