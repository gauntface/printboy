<script>
  export let addresses;

	async function submitAddress(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const addresses = data.getAll("address");
		for (const a of addresses) {
      if (!a) {
        console.log(`Ignoring empty value '${a}'`);
        continue;
      }

			try {
				await fetch(`/presets/add-address`, {
					method: 'POST',
					body: JSON.stringify({
						address: a,
					}),
				});
				window.location.reload();
			} catch (err) {
				console.error(`Failed to add address: `, err);
			}
		}
	}

  async function deleteAddress(filename) {
    try {
      await fetch(`/presets/delete-address`, {
        method: 'POST',
        body: JSON.stringify({
          filename,
        }),
      });
      window.location.reload();
    } catch (err) {
      console.error(`Failed to delete address ${filename}: `, err);
    }
  }
</script>

<div class="l-labeladdresses">
  {#each addresses as addr}
  <div class="c-labeladdress--text"><pre>{addr.text}</pre></div>
  <div>
    <button class="c-labeladdress--delete" on:click={deleteAddress(addr.filename)}>Delete 🗑️</button>
  </div>
  {/each}
</div>

<h3>Add new address</h3>

<form method="post" on:submit={submitAddress}>
  <textarea rows=7 cols=80 name="address"></textarea>
  <button type="submit">Add address</button>
</form>

<style>
  .l-labeladdresses {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
  }

  .l-labeladdresses pre {
    margin: 0;
    padding: 12px;
  }
</style>