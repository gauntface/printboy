<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
</script>

<div>
  <p>Please select or upload an image for use with your label or select next to create a label without an image:</p>

  <form method="post" on:submit={onSubmit}>

    {#if labelPresets && labelPresets.images && labelPresets.images.length}
      <div class="l-imgradios">
        <div class="c-imgradio">
          <input type="radio" name="labelimage" id="blank" value="">
          <label for="blank">No Image</label>
        </div>
        {#each labelPresets.images as imgOpt}
          <div class="c-imgradio">
            <input type="radio" name="labelimage" id={imgOpt.filename} value={imgOpt.filename} checked={initialValues.labelimage == imgOpt.filename}>
            <label for={imgOpt.filename} style="background-image: url({imgOpt.base64})">{imgOpt.filename}</label>
          </div>
        {/each}
      </div>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <p><label for="uploadlabelimage">Upload a new label:</label></p>

    <p><input type="file"
          id="uploadlabelimage" name="uploadlabelimage"
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

  .c-imgradio {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .c-imgradio label {
    display: inline-block;
    width: 100%;
    min-height: 150px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-indent: -9999px;
    border-style: solid;
    border-width: 4px;
    border-color: transparent;
    border-radius: 8px;
  }

  .c-imgradio input {
    display: none;
  }

  .c-formhr {
    text-align: center;
  }

  input[type="radio"]:checked + label {
    border-color: var(--accent-color);
  }
</style>