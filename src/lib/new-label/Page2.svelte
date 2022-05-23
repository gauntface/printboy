<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
  export let widthInches;
  export let heightInches;
</script>

<div>
  <p>Please select or enter a title for the label (this will be the first line
    on the label and will be in bold):</p>

  <form class="js-form" method="post" on:submit={onSubmit}>
    {#if labelPresets && labelPresets.titles && labelPresets.titles.length}
      <ul class="l-titleradios">
        <li class="c-titleradio">
          <input type="radio" name="labeltitle" id="blank" value="">
          <label for="blank">No Name</label>
        </li>
        {#each labelPresets.titles as titleOpt}
        <li class="c-titleradio">
            <input type="radio" name="labeltitle" id={titleOpt.filename} value={titleOpt.text} checked={initialValues.labeltitle == titleOpt}>
            <label for={titleOpt.filename}>{titleOpt.text}</label>
        </li>
        {/each}
      </ul>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <div>
      <label for=customtitle>Enter a new title</label>
      <br/>
      <input id=customtitle name=labeltitle value={initialValues.labeltitle ? initialValues.labeltitle : ''}>
    </div>

    <div>
      <button type=button on:click={() => onBack(document.querySelector('.js-form'))}>Previous page</button>
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

  .l-titleradios {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>