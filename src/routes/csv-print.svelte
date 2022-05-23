<script context="module">
	import { browser, dev } from '$app/env';
  import LabelPreview from '../lib/labelpreview/LabelPreview.svelte';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// serve as a static asset in prod
	export const prerender = true;
</script>

<script>
  let labels = [];
  let width = 4;
  let height = 2.25;

  function onSubmit(e) {
    e.preventDefault();
    labels = [];
		const data = new FormData(e.target);
		const csvFields = data.getAll("csv");
    for (const cf of csvFields) {
      let reader = new FileReader();
      reader.readAsText(cf);
			reader.onload = async (e) => {
        const resp = await fetch('/api/parse-csv', {
          method: 'POST',
          body: e.target.result,
        });
        const records = await resp.json();
        for (const row of records) {
          const img = row[0];
          const title = row[1];
          const address = row[2];

          if (!address) {
            console.warn(`Skipping record due to no address: `, row);
            continue;
          }

          labels.push({
            labelimage: img.trim(),
            labeltitle: title.trim(),
            labeladdress: address.trim(),
          });
        }
        labels = labels;
			}
    }
  }
</script>

<svelte:head>
	<title>CSV Print</title>
</svelte:head>

<div class="content">
	<h1>CSV Print</h1>

  <form method="post" on:submit|preventDefault={onSubmit}>
    <input type="file"
       id="csv" name="csv"
       accept=".csv">
    <button type="submit">Submit</button>
  </form>

  <section class="l-labelpreviews">
    {#each labels as label}
      <LabelPreview values={label} widthInches={width} heightInches={height}></LabelPreview>
    {/each}
  </section>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

  .l-labelpreviews {
    display: grid;
    margin: 24px 0;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
</style>
