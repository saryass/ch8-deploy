<!-- SEO: This sets layout-specific defaults and allows pages to override them dynamically. -->
<script>
    import MainNavTop from "../components/MainNav/MainNavTop.svelte";
    import MainNavBtm from "../components/MainNav/MainNavBtm.svelte";
    import { page } from '$app/stores';

    // Set default values for title and description
    export let title = "Default Layout Title";
    export let description = "Default layout description";

    // Override with page-specific data if available
    $: title = $page.data?.title || title;
    $: description = $page.data?.description || description;

    import '../app.css';
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
</svelte:head>

<div class="appNavbar">
    <MainNavTop />
    <MainNavBtm />
</div>
<slot />


<style>
	.appNavbar {
		background-color: rgba(255, 255, 255, 1);
		position: sticky;
		top: 0;
		left: 0;
		padding-top: 25px;
	}
</style>
