<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
</script>

<div>
  <p>Please select an image for use with your label:</p>

  <form class="js-page2-form" method="post" on:submit={onSubmit}>
    <div>
      <label for=name>Name</label>
      <br/>
      <input id=name name=name value={initialValues.name ? initialValues.name : ''}>
    </div>

    <div>
      <label for=address>Address (or Text)</label>
      <br/>
      <textarea id=address name=address rows=6>{initialValues.address ? initialValues.address : ''}</textarea>
    </div>

    <div>
      <button type=button on:click={() => onBack(document.querySelector('.js-page2-form'))}>Previous page</button>
      <button type=submit>Next page</button>
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