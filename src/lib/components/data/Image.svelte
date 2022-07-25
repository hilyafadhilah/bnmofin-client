<script lang="ts">
	export let src: string | undefined;
	export let alt: string;

	export let loaded = false;

	$: if (!src) {
		loaded = false;
	}
</script>

{#if !loaded}
	<slot />
{/if}

{#if src}
	<img
		{src}
		{alt}
		on:load={() => (loaded = true)}
		class:opacity-0={!loaded}
		class="transition-opacity {$$props.class}"
		style={$$props.style}
	/>
{/if}
