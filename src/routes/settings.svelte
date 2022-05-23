<script context="module">
	import { browser } from '$app/env';

	export const router = browser;
</script>

<script>
	import LabelImages from '../lib/settings/LabelImages.svelte';
	import LabelTitles from '../lib/settings/LabelTitles.svelte';
	import LabelAddresses from '../lib/settings/LabelAddresses.svelte';

	export let labelPresets;
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="content">
	<h1>Settings</h1>

	<main>
	<section>
		<h2>Preset Images</h2>
		<LabelImages images={labelPresets.images}></LabelImages>
	</section>

	<section>
		<h2>Preset Titles</h2>
		<LabelTitles titles={labelPresets.titles}></LabelTitles>
	</section>

	<section>
		<h2>Preset addresses</h2>
		<LabelAddresses addresses={labelPresets.addresses}></LabelAddresses>
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
