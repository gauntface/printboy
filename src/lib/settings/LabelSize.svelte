<script>
  export let sizes;
  export let currentSize;

  async function updateLabelSize(e) {
    e.preventDefault();
    const data = new FormData(e.target);
		const size = data.get("size");
    if (!size.trim()) {
      return;
    }

    const selected = parseInt(size, 10);
    try {
      await fetch(`/api/config/size`, {
        method: 'POST',
        body: JSON.stringify({
          id: selected,
        }),
      });
      window.location.reload();
    } catch (err) {
      console.error(`Failed to add name: `, err);
    }
  }
</script>

<div class="l-labelsizes">
  <form method="post" on:submit|preventDefault={updateLabelSize}>
    <select name="size" id="size">
      <option value="">--- Please Select a Label ---</option>
    {#each sizes as size}
      <option value="{size.id}" selected={size.id == currentSize.id}>{size.name} - {size.widthInches}" x {size.heightInches}"</option>
    {/each}
    </select>
    <button type="submit">Update Label Size</button>
  </form>
</div>
