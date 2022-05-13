<script>
  export let images;

  function uploadImage(e) {
		e.preventDefault();
		const data = new FormData(e.target);
		const images = data.getAll("uploadImage");
		for (const img of images) {
			if (!img.name) {
        console.log(`Ignoring empty value '${img.name}'`, img);
        continue;
      }

			let reader = new FileReader();
			reader.readAsDataURL(img);
			reader.onload = async (e) => {
				try {
					await fetch(`/presets/add-image`, {
						method: 'POST',
						body: JSON.stringify({
							filename: img.name,
							base64: e.target.result,
						}),
					});
					window.location.reload();
				} catch (err) {
					console.error(`Failed to upload image: `, err);
				}
			}
		}
	}

  async function deleteImage(imgFileName) {
		try {
      await fetch(`/presets/delete-image`, {
        method: 'POST',
        body: JSON.stringify({
          filename: imgFileName,
        }),
      });
      window.location.reload();
    } catch (err) {
      console.error(`Failed to delete image ${imgFileName}: `, err);
    }
	}
</script>
<ul class="l-labelimages">
  {#each images as imgOpt}
  <li class="c-labelimage">
    <img src={imgOpt.base64} alt={imgOpt.filename} class="c-labelimage--img" />
    <div class="c-labelimage--btns">
      <button on:click={deleteImage(imgOpt.filename)}>Delete 🗑️</button>
    </div>
  </li>
  {/each}
</ul>

<h3>Upload new image</h3>

<form method="post" on:submit={uploadImage}>
  <input type="file" name="uploadImage">
  <button type="submit">Upload</button>
</form>

<style>
  .l-labelimages {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 24px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.c-labelimage {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.c-labelimage--img {
		width: 150px;
		height: 150px;
	}

	.c-labelimage--btns {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>