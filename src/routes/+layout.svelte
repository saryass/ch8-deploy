<script>
	import MainNavTop from '../components/MainNav/MainNavTop.svelte';
	import MainNavBtm from '../components/MainNav/MainNavBtm.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>CHANNEL8 - You Deserve the Truth</title>
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
