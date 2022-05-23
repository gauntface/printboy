<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
  export let widthInches;
  export let heightInches;

  console.log(`widthInches `, widthInches, heightInches);
  console.log(`initialValues `, initialValues);
</script>

<div>
  <p>Please select or upload an image for use with your label or select next to create a label without an image:</p>

  <form method="post" on:submit|preventDefault={onSubmit}>

    {#if labelPresets && labelPresets.images && labelPresets.images.length}
      <div class="l-imgradios">
        <div class="c-imgradio">
          <input type="radio" name="labelimage" id="blank" value="">
          <label for="blank">
            <div class="c-imgradio__img"></div>
            <span>No Image</span>
          </label>
        </div>
        {#each labelPresets.images as imgOpt}
          <div class="c-imgradio">
            <input type="radio" name="labelimage" id={imgOpt.filename} value={imgOpt.base64} checked={initialValues.labelimage == imgOpt.filename}>
            <label for={imgOpt.filename}>
              <img class="c-imgradio__img" src="{imgOpt.base64}" alt="Image of {imgOpt.filename}" />
              <span>{imgOpt.filename}</span>
            </label>
          </div>
        {/each}
      </div>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <p><label for="uploadlabelimage">Upload a new label:</label></p>

    <p><input type="file"
          id="uploadlabelimage" name="labelimage"
          accept="image/png, image/jpeg, image/svg"></p>
    <br />
    <p><button type=submit>Next page</button></p>
  </form>
</div>

<style>
  .l-imgradios {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .c-imgradio__img {
    display: inline-block;
    width: 150px;
    max-width: 150px;
    min-height: 150px;
  }

  .c-imgradio input {
    display: none;
  }

  .c-imgradio label {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-style: solid;
    border-width: 4px;
    border-color: transparent;
    border-radius: 8px;
  }

  .c-formhr {
    text-align: center;
  }

  input[type="radio"]:checked + label {
    border-color: var(--accent-color);
  }
</style>