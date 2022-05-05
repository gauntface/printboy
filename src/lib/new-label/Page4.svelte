<script>
  export let initialValues;
	export let onSubmit;
	export let onBack;
</script>

<div>
  <p>Printing {initialValues.copies} copies of your label.</p>

  <form class="js-page3-form" method="post" on:submit={onSubmit}>
    <div>
      <p>Would you like to save this label?</p>
      <label>
        <input type="radio" name="savelabel">
        Yes
      </label>
      <label>
        <input type="radio" name="savelabel">
        No
      </label>
    </div>

    <div>
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