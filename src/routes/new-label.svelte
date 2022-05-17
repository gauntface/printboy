<script context="module">
	import { browser, dev } from '$app/env';
  import { goto } from '$app/navigation';

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
  import Page1 from '$lib/new-label/Page1.svelte';
  import Page2 from '$lib/new-label/Page2.svelte';
  import Page3 from '$lib/new-label/Page3.svelte';
  import PagePreview from '$lib/new-label/PagePreview.svelte';

  export let labelPresets;

  const pages = [Page1, Page2, Page3, PagePreview];
  let page = 0;
  let pageState = {};

  function updateValues(form) {
    const data = new FormData(form);

    for (const k of data.keys()) {
      const v = data.get(k);
      if (v.type == "application/octet-stream" && !v.name) {
        continue;
      }
      if (!v) {
        continue;
      }
      pageState[k] = v;
    }
    console.log(pageState);
  }

  function onSubmit(e) {
    e.preventDefault();

    updateValues(e.target);

    if(page == pages.length - 1) {
      console.log(`TODO: Submit data: `, pageState);
      goto('/');
      return;
    }

    page += 1;
  }

  function onBack(form) {
    if(page == 0) {
      return
    }

    updateValues(form);

    page -= 1;
  }
</script>

<svelte:head>
	<title>New Label</title>
</svelte:head>

<div class="content">
	<h1>New Label</h1>
  <h2>Step {page + 1} of {pages.length}</h2>

  <svelte:component
  this={pages[page]}
  {labelPresets}
  {onSubmit}
  {onBack}
  initialValues={pageState}
  />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
