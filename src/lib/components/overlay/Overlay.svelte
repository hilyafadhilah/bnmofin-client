<script lang="ts">
	import { fade } from "svelte/transition";
	export let isOpen = false;
	export let persistent = false;
	export let duration = 300;
</script>

{#if isOpen}
	<div
		transition:fade={{ duration }}
		style:z-index="100"
		class="
			fixed top-0 left-0 w-full h-full
			bg-slate-900 bg-opacity-60
			{$$props.class}
		"
		on:click|self={() => {
			if (!persistent) isOpen = false;
		}}
	>
		<slot />
	</div>
{/if}
