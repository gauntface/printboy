<script>
	export let initialValues;
	export let onSubmit;
	export let onBack;

  const imageOptions = [
    {
      id: 'mashley',
      title: 'Mashley',
    },
    {
      id: 'miniworks',
      title: 'Miniworks',
    },
    {
      id: 'gauntdev',
      title: 'gaunt.dev',
    },
  ];
</script>

<div>
  <p>Please select an image for use with your label:</p>

  <form method="post" on:submit={onSubmit}>
    <div class="l-imgradios">
      {#each imageOptions as imgOpt}
        <div class="c-imgradio">
          <input type="radio" name="labelimage" id={imgOpt.id} value={imgOpt.id} checked={initialValues.labelimage == imgOpt.id}>
          <label for={imgOpt.id} style="background-image: url(/labelimages/{imgOpt.id}.svg)">{imgOpt.title}</label>
        </div>
      {/each}
    </div>
    <p class="c-formhr"><i>or</i></p>
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
    grid-template-columns: 1fr 1fr 1fr;
  }

  .c-imgradio {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .c-imgradio label {
    display: inline-block;
    width: 150px;
    height: 150px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-indent: -9999px;
  }

  .c-imgradio input {
    display: none;
  }

  .c-formhr {
    text-align: center;
  }

  input[type="radio"]:checked + label {
    border-style: solid;
    border-width: 4px;
    border-color: var(--accent-color);
    border-radius: 8px;
  }
</style>