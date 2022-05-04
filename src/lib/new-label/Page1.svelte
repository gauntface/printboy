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
          <input type="radio" name="labelimage" id={imgOpt.id} value={imgOpt.id}>
          <label for={imgOpt.id} style="background-image: url(/labelimages/{imgOpt.id}.svg)">{imgOpt.title}</label>
        </div>
      {/each}
    </div>
    <button type=submit>Next page</button>
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
</style>