<script>
	/** @type {import('./$types').PageData} */
	export let data; // Declare a prop named 'data' to hold the data passed from the server-side load function
</script>

<svelte:head>
	<title>CHANNEL8 - You Deserve the Truth</title>

	<meta property="og:title" content="CHANNEL8" />
	<meta
		property="og:url"
		content="https://ch8-deployment-1ndau2img-saryass-projects.vercel.app/english"
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:description"
		content="Visit CHANNEL8 and read the latest headlines about Kurdistan, Iraq, Middle East and the world."
	/>
	<meta
		property="og:image"
		content="https://media8.fra1.cdn.digitaloceanspaces.com/assets/image/fallback_cover_en.webp"
	/>
	<meta property="og:locale" content="en_US" />



	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="CHANNEL8" />
	<meta
		name="twitter:description"
		content="Visit CHANNEL8 and read the latest headlines about Kurdistan, Iraq, Middle East and the world."
	/>
	<meta
		name="twitter:url"
		content="https://ch8-deployment-1ndau2img-saryass-projects.vercel.app/english"
	/>
	<meta
		name="twitter:image"
		content="https://media8.fra1.cdn.digitaloceanspaces.com/assets/image/fallback_cover_en.webp"
	/>
</svelte:head>

<h1>English Home Page</h1>

{#if data.error}
	<h1>Error: {data.error}</h1>
	<!-- Display an error message if there is an error in the data -->
{:else}
	<main>
		<div class="politiccontainer">
			<h2>Politics News</h2>
			{#if data.politicsNews.length > 0}
				<div class="news-category">
					{#each data.politicsNews as news}
						<div class="news-item">
							<!-- <h3>{news.title}</h3> -->
							<div>
								<a
									href={`/english/${news.wp_post_id}`}
									data-sveltekit-preload-data
									data-sveltekit-prefetch
								>
									<!-- Link to the news article detail page -->
									<img src={news.thumbnailURL} alt={news.title} width="300px" height="200px" />
								</a>
							</div>
							<!-- <p>Published on: {news.published_at}</p> -->
						</div>
					{/each}
				</div>
			{:else}
				<p>No Politics news found.</p>
				<!-- Display a message if no Politics news articles are found -->
			{/if}
		</div>

		<div class="businessContainer">
			<h2>Business News</h2>
			{#if data.businessNews.length > 0}
				<div class="news-category">
					{#each data.businessNews as news}
						<div class="news-item">
							<!-- <h3>{news.title}</h3> -->
							<div>
								<a
									href={`/english/${news.wp_post_id}`}
									data-sveltekit-preload-data
									data-sveltekit-prefetch
								>
									<img src={news.thumbnailURL} alt={news.title} width="300px" height="200px" />
								</a>
							</div>
							<!-- <p>Published on: {news.published_at}</p> -->
						</div>
					{/each}
				</div>
			{:else}
				<p>No Business news found.</p>
				<!-- Display a message if no Business news articles are found -->
			{/if}
		</div>

		<div class="healthcontainer">
			<h2>Health News</h2>
			{#if data.healthNews.length > 0}
				<div class="news-category">
					{#each data.healthNews as news}
						<div class="news-item">
							<!-- <h3>{news.title}</h3> -->
							<div>
								<a
									href={`/english/${news.wp_post_id}`}
									data-sveltekit-preload-data
									data-sveltekit-prefetch
								>
									<img src={news.thumbnailURL} alt={news.title} width="300px" height="200px" />
								</a>
							</div>
							<!-- <p>Published on: {news.published_at}</p> -->
						</div>
					{/each}
				</div>
			{:else}
				<p>No Health news found.</p>
				<!-- Display a message if no Health news articles are found -->
			{/if}
		</div>

		<div class="sportcontainer">
			<h2>Sports News</h2>
			{#if data.sportsNews.length > 0}
				<div class="news-category">
					{#each data.sportsNews as news}
						<div class="news-item">
							<!-- <h3>{news.title}</h3> -->
							<div>
								<a
									href={`/english/${news.wp_post_id}`}
									data-sveltekit-preload-data
									data-sveltekit-prefetch
								>
									<img src={news.thumbnailURL} alt={news.title} width="300px" height="200px" />
								</a>
							</div>
							<!-- <p>Published on: {news.published_at}</p> -->
						</div>
					{/each}
				</div>
			{:else}
				<p>No Sports news found.</p>
				<!-- Display a message if no Sports news articles are found -->
			{/if}
		</div>
	</main>
{/if}

<style>
	h1 {
		background-color: rgb(198, 237, 139);
		text-align: center;
		padding: 10px 0 10px 0;
	}

	main {
		display: flex;
		justify-content: space-between;
		margin-top: 30px;
		padding: 20px;
	}
</style>
