<script>
  export let titles;

  async function addTitle(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const names = data.getAll("name");
		for (const n of names) {
      if (!n) {
        console.log(`Ignoring empty value '${n}'`);
        continue;
      }

			try {
					await fetch(`/presets/add-title`, {
						method: 'POST',
						body: JSON.stringify({
							name: n,
						}),
					});
					window.location.reload();
				} catch (err) {
					console.error(`Failed to add name: `, err);
				}
		}
	}

  async function deleteTitle(filename) {
    try {
      await fetch(`/presets/delete-title`, {
        method: 'POST',
        body: JSON.stringify({
          filename,
        }),
      });
      window.location.reload();
    } catch (err) {
      console.error(`Failed to delete title ${filename}: `, err);
    }
  }
</script>

<div class="l-labeltitles">
  {#each titles as title}
  <div class="c-labeltitle--text">{title.text}</div>
  <div>
    <button class="c-labeltitle--delete" on:click={deleteTitle(title.filename)}>Delete 🗑️</button>
  </div>
  {/each}
</div>

<h3>Add new name</h3>

<form method="post" on:submit={addTitle}>
  <input type="text" name="name">
  <button type="submit">Add name</button>
</form>

<style>
  .l-labeltitles {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
  }

  .c-labeltitle--text {
    font-size: 1.6rem;
    font-weight: bold;
  }
</style>