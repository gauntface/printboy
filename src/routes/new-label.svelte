<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script>
	import Page1 from '$lib/new-label/Page1.svelte';
  import Page2 from '$lib/new-label/Page2.svelte';

  const pages = [Page1, Page2];
  let page = 0;
  let pageState = {};

  function onSubmit(values) {
    console.log(`Hello Matt?`);
    if(page == pages.length - 1) {
      console.log(`TODO: Submit data: `, pageState);
      return;
    }

    // TODO Update pageState
    console.log(`Page State: `, pageState);
    console.log(`New Values? `, values);

    page += 1;
  }

  function onBack(values) {
    if(page == 0) {
      return
    }

    // TODO Update pageState
    console.log(`Page State: `, pageState);
    console.log(`New Values? `, values);

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
