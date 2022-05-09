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

	async function submitName(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const names = data.getAll("name");
		for (const n of names) {
			try {
					await fetch(`/presets/add-name`, {
						method: 'POST',
						body: JSON.stringify({
							name: n,
						}),
					});
					window.location.reload();
				} catch (err) {
					console.error(`Failed to add name: `, err);
				}
		}
	}

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
		<h2>Preset Names</h2>

		<ul class="l-labelimages">
			{#each labelPresets.names as name}
				<li><pre>{name}</pre></li>
			{/each}
		</ul>

		<h3>Add new name</h3>

		<form method="post" on:submit={submitName}>
			<input type="text" name="name">
			<button type="submit">Add name</button>
		</form>
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
