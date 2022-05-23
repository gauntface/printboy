<script>
	export let initialValues;
	export let onSubmit;
  export let onBack;
  export let labelPresets;
  export let widthInches;
  export let heightInches;
</script>

<div>
  <p>Please select an address for use with your label:</p>

  <form class="js-form" method="post" on:submit={onSubmit}>
    {#if labelPresets && labelPresets.addresses && labelPresets.addresses.length}
      <ul class="l-addressradios">
        <li class="c-addressradio">
          <input type="radio" name="labeladdress" id="blank" value="">
          <label for="blank"><pre>No Address</pre></label>
        </li>
        {#each labelPresets.addresses as addrOpt}
        <li class="c-addressradio">
            <input type="radio" name="labeladdress" id={addrOpt.filename} value={addrOpt.text} checked={initialValues.labelname == addrOpt}>
            <label for={addrOpt.filename}><pre>{addrOpt.text}</pre></label>
        </li>
        {/each}
      </ul>
      <p class="c-formhr"><i>or</i></p>
    {/if}

    <div>
      <label for=customaddress>Enter a new address (or Text)</label>
      <br/>
      <textarea id=customaddress name=labeladdress rows=6 cols=40>{initialValues.labeladdress ? initialValues.labeladdress : ''}</textarea>
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

  .l-addressradios {
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .c-addressradio {
    display: flex;
    flex-direction: row;
  }

  .c-addressradio pre {
    margin: 0;
    padding: 12px;
  }
</style>