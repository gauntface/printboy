<script context="module">
	import { browser, dev } from '$app/env';
  import LabelPreview from '../lib/labelpreview/LabelPreview.svelte';

	export const router = browser;
</script>

<script>
  let labelGroups = [];
  let labelGroupSize = 2 * 3;
  export let widthInches;
  export let heightInches;

  function onSubmit(e) {
    e.preventDefault();
    labelGroups = [];
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
        let group = [];
        for (const row of records) {
          if (group.length >= labelGroupSize) {
            labelGroups.push(group);
            group = [];
          }

          const img = row[0];
          const title = row[1];
          const address = row[2];

          if (!address) {
            console.warn(`Skipping record due to no address: `, row);
            continue;
          }

          group.push({
            labelimage: img.trim(),
            labeltitle: title.trim(),
            labeladdress: address.trim(),
          });
        }
        labelGroups.push(group);
        labelGroups = labelGroups;
			}
    }
  }

  async function printBatch(e, groupSelector) {
    e.preventDefault();
    e.target.disabled = true;

    const labels = document.querySelectorAll(`.${groupSelector} canvas`);

    for (const c of labels) {
      try {
        const resp = await fetch('/api/print', {
          method: 'post',
          body: JSON.stringify({
            copies: 1,
            base64: c.toDataURL(),
            widthInches: widthInches,
            heightInches: heightInches,
          }),
        })
      } catch (err) {
        console.error('Failed to print: ', err);
      }
    }

    e.target.disabled = false;
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


    {#each labelGroups as group, i}
      <section class="l-labelpreviews js-label-group-{i}">
      {#each group as label}
        <LabelPreview values={label} widthInches={width} heightInches={height}></LabelPreview>
      {/each}
      </section>
      <p><button on:click={(e) => printBatch(e, `js-label-group-${i}`)}>Print</button></p>
    {/each}
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
