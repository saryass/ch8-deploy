<script>
    export let data; // Declare a prop named 'data' to hold the data passed from the server-side load function
</script>

<svelte:head>
    <title>{data.title}</title> <!-- SEO: Set the page title dynamically based on the data passed from the load function -->
    <meta name="description" content={data.description} /> <!--SEO: Set the meta description dynamically based on the data passed from the load function -->
</svelte:head>


{#if data.error}
    <h1>Error: {data.error.message}</h1> <!-- Display an error message if there is an error in the data -->
{:else}
    {#if data.singleNews}
        <div class="singleBox">
            <h1>{data.singleNews.title}</h1> <!-- Display the title of the clicked news article -->
            <div>
                <img class="clickedNews" src={data.singleNews.thumbnailURL} alt={data.singleNews.title} /> <!-- Display the thumbnail image of the clicked news article -->
            </div>
            <p>{data.singleNews.published_at}</p> <!-- Display the published date of the clicked news article -->
            <p>Category: {data.singleNews.category.join(', ')}</p> <!-- Display the categories of the clicked news article -->
            <p>Author: {data.singleNews.authorName}</p> <!-- Display the author's name of the clicked news article -->
            <p>{@html data.singleNews.content}</p> <!-- Display the content of the clicked news article -->
        </div>
    {/if}

    <h2 class="relatedNewsHeading">Related News</h2> <!-- Heading for the related news section -->
    {#if data.relatedNews && data.relatedNews.length > 0}
        <div class="relatedBox">
            {#each data.relatedNews as News}
                <div class="SubrelatedBox">
                    <a href={`/english/${News.wp_post_id}`} data-sveltekit-preload-data data-sveltekit-prefetch>
                        <img src={News.thumbnailURL} alt={News.title} width="300px" height="200px" /> <!-- Display the thumbnail image of the related news article with a link to its page -->
                    </a>
                    <p>{News.published_at}</p> <!-- Display the published date of the related news article -->
                    <!-- <p>{News.authorName}</p> -->
                </div>
            {/each}
        </div>
    {:else}
        <p>No related News found</p> <!-- Display a message if no related news articles are found -->
    {/if}
{/if}


<style>
	.singleBox {
		/* border: 2px solid red; */
		padding: 25px;
	}
	.clickedNews {
		width: 800px;
		height: 400px;
		object-fit: cover;
	}

	.relatedBox {
		/* border: 2px solid blue; */
		display: flex;
		justify-content: space-between;
		padding: 25px;
	}
	.SubrelatedBox {
		display: flex;
		flex-direction: column;
		/* align-items: center; */
	}
	.relatedNewsHeading {
		text-align: center;
	}
</style>








