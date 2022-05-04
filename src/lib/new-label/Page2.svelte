<script>
  export let initialValues;
	export let onSubmit;
	export let onBack;
</script>

<div>
  <p>Please select an image for use with your label:</p>

  <form>
    <label for=name>Name</label>
    <input id=name name=name>
    <label for=address>Address (or Text)</label>
    <input id=address name=address><br>
    <button type=button on:click={() => onBack(initialValues)}>Previous page</button>
    <button type=submit>Next page</button>
  </form>
</div>