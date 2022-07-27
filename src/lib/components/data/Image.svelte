<script lang="ts">
	import Exclamation from "../icons/Exclamation.svelte";

	export let src: string | undefined;
	export let alt: string;

	export let error = false;
	$: error = src === "error";

	export let loaded = false;

	$: if (!src) {
		loaded = false;
	}
</script>

{#if !loaded && !error}
	<slot />
{/if}

{#if error}
	<slot name="error">
		<Exclamation class="text-slate-600 h-16 w-16" />
	</slot>
{:else if src}
	<img
		{src}
		{alt}
		on:load={() => (loaded = true)}
		class:opacity-0={!loaded}
		class="transition-opacity {$$props.class}"
		style={$$props.style}
	/>
{/if}
