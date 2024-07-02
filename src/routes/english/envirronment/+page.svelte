<script>
	// Import the type for PageData to enable TypeScript support
	/** @type {import('./$types').PageData} */
	// Declare a prop named 'data' to hold the data passed from the server-side load function
	export let data;
</script>

<svelte:head>
    <title>{data.title}</title>
    <meta name="description" content={data.description} />
</svelte:head>

<!-- Heading for the page -->
<h1>Evnironment News Page</h1>

<!-- Check if there are any politic News in the data -->
{#if data.zanyar.length > 0}
	<!-- Loop through each politic news in the data and display its details -->
	<div class="eachblock">
		{#each data.zanyar as environmentNews}
			<!-- Display the politic news title -->
			<h2>{environmentNews.title}</h2>
			<!-- Container for the politic news thumbnail -->
			<div>
				<!-- Link to the politic news's detail page with prefetching enabled -->
				<a href={`/english/${environmentNews.wp_post_id}`} data-sveltekit-preload-data data-sveltekit-prefetch>
					<!-- Display the politic news's thumbnail image with specified dimensions -->
					<img
						src={environmentNews.thumbnailURL}
						alt={environmentNews.title}
						width="300px"
						height="200px"
					/>
				</a>
			</div>
			<!-- Display the politic news's publication date -->
			<p>Published on: {environmentNews.published_at}</p>
		{/each}
	</div>
{:else}
	<!-- Display a message if no politic News are found -->
	<p>No politic news found.</p>
{/if}

<!-- General Tasks -->
<!--
1. Declares a prop 'data' to hold the data fetched from the server.
2. Displays a heading for the Politics politic News page.
3. Checks if there are any politic News available in the 'data' prop.
4. Iterates over the list of politic News and displays each politic news's title, thumbnail, and publication date.
5. Provides a link to each politic news's detail page with prefetching enabled.
6. Displays a message if no politic News are found.
-->

<style>
	h1 {
		background-color: yellow;
		text-align: center;
		padding: 10px 0 10px 0;
	}

	.eachblock {
		padding: 25px
	}
</style>
