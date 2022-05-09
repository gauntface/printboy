<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
</script>

<div>
  <p>Please select an image for use with your label:</p>

  <form class="js-page2-form" method="post" on:submit={onSubmit}>
    {#if labelPresets && labelPresets.names && labelPresets.names.length}
      <ul class="l-nameradios">
        <li class="c-nameradio">
          <input type="radio" name="labelname" id="blank" value="*Blank*">
          <label for="blank">No Name</label>
        </li>
        {#each labelPresets.names as nameOpt}
        <li class="c-nameradio">
            <input type="radio" name="labelname" id={nameOpt} value={nameOpt} checked={initialValues.labelname == nameOpt}>
            <label for={nameOpt}>{nameOpt}</label>
        </li>
        {/each}
      </ul>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <div>
      <label for=name>Enter a new name</label>
      <br/>
      <input id=name name=name value={initialValues.name ? initialValues.name : ''}>
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