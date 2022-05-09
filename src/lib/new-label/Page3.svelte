<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
</script>

<div>
  <p>Please select an image for use with your label:</p>

  <form class="js-page2-form" method="post" on:submit={onSubmit}>
    {#if labelPresets && labelPresets.addresses && labelPresets.addresses.length}
      <ul class="l-nameradios">
        <li class="c-nameradio">
          <input type="radio" name="labeladdress" id="blank" value="*Blank*">
          <label for="blank"><pre>No Address</pre></label>
        </li>
        {#each labelPresets.addresses as addrOpt}
        <li class="c-nameradio">
            <input type="radio" name="labeladdress" id={addrOpt} value={addrOpt} checked={initialValues.labelname == addrOpt}>
            <label for={addrOpt}><pre>{addrOpt}</pre></label>
        </li>
        {/each}
      </ul>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <div>
      <label for=address>Enter a new address (or Text)</label>
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