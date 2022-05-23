<script>
  import LabelPreview from '../labelpreview/LabelPreview.svelte';

	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;

  // TODO: Make this configurable
  let width = 4;
  let height= 2.25;

  let canvas;

  async function printLabels(e, f) {
    e.preventDefault();
    e.target.disabled = true;

    const data = new FormData(f);
    const c = data.get("copies");
    const copies = parseInt(c, 10);

    try {
      const resp = await fetch('/api/print', {
        method: 'post',
        body: JSON.stringify({
          copies: copies,
          base64: canvas.toDataURL(),
          widthInches: width,
          heightInches: height,
        }),
      })
    } catch (err) {
      console.error('Failed to print: ', err);
    }
    e.target.disabled = false;
  }
</script>

<div>
  <p>Print you label if it looks good.</p>

  <LabelPreview bind:canvas={canvas} values={initialValues} widthInches={width} heightInches={height}></LabelPreview>

  <form class="js-form" method="post" on:submit={onSubmit}>
    <div>
      <label for=copies>Copies</label>
      <br/>
      <input id=copies name=copies type=number value={initialValues.copies ? initialValues.copies : '1'}>
    </div>

    <div>
      <button type=button on:click={() => onBack(document.querySelector('.js-form'))}>Previous page</button>
      <button type=button on:click={(e) => printLabels(e, document.querySelector('.js-form'))}>Print Label</button>
      <button type=submit>Done</button>
    </div>
  </form>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>