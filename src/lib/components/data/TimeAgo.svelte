<script lang="ts">
	import { timeAgo } from "$utils/data";
	import { onDestroy, onMount } from "svelte";

	export let date: Date;

	let display = timeAgo.format(date);
	let intervalId: any;

	onMount(() => {
		intervalId = setInterval(() => {
			display = timeAgo.format(date);
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

{display}
