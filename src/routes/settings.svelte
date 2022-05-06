<script context="module">
	import { browser, dev } from '$app/env';

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;
</script>

<script>
	export let labelPresets;

	function uploadImage(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const images = data.getAll("uploadImage");
		for (const img of images) {
			let reader = new FileReader();
			reader.readAsDataURL(img);
			reader.onload = async (e) => {
				try {
					await fetch(`/presets/upload-image`, {
						method: 'POST',
						body: JSON.stringify({
							filename: img.name,
							base64: e.target.result,
						}),
					});
					window.location.reload();
				} catch (err) {
					console.error(`Failed to upload image: `, err);
				}
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

		<div class="l-labelimages">
			{#each labelPresets.images as imgOpt}
				<img src={imgOpt.base64} alt={imgOpt.filename} />
			{/each}
		</div>

		<h3>Upload new image</h3>

		<form method="post" on:submit={uploadImage}>
			<input type="file" name="uploadImage">
			<button type="submit">Upload</button>
		</form>
	</section>

	<section>
		<h2>Preset Text</h2>
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

	.l-labelimages {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 24px;
	}

	.l-labelimages > img {
		width: 150px;
		height: 150px;
	}
</style>
