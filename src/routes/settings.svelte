<script context="module">
	import { browser } from '$app/env';

	export const router = browser;
</script>

<script>
	import LabelImages from '../lib/settings/LabelImages.svelte';
	import LabelTitles from '../lib/settings/LabelTitles.svelte';
	import LabelAddresses from '../lib/settings/LabelAddresses.svelte';
	import LabelSize from '../lib/settings/LabelSize.svelte';

	export let labelPresets;
	export let supportedSizes;
	export let currentSize;

	console.log(`Current Size => `, currentSize);
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
		<h2>Preset Addresses</h2>
		<LabelAddresses addresses={labelPresets.addresses}></LabelAddresses>
	</section>

	<section>
		<h2>Label Size</h2>
		<LabelSize sizes={supportedSizes} currentSize={currentSize}></LabelSize>
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
