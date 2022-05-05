<script>
  export let initialValues;
	export let onSubmit;
	export let onBack;
</script>

<div>
  <p>Does look good?</p>

  <div>
    TODO: Matt you need to show a demo of the label
  </div>

  <form class="js-page3-form" method="post" on:submit={onSubmit}>
    <div>
      <label for=copies>Copies</label>
      <br/>
      <input id=copies name=copies type=number value={initialValues.copies ? initialValues.copies : '1'}>
    </div>

    <div>
      <button type=button on:click={() => onBack(document.querySelector('.js-page2-form'))}>Previous page</button>
      <button type=submit>Print Label</button>
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