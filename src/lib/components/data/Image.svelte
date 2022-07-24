<script lang="ts">
	export let src: string | undefined;
	export let alt: string;

	let loaded = false;
</script>

{#if !loaded}
	<slot />
{/if}

{#if src}
	<img
		{src}
		{alt}
		on:load={() => (loaded = true)}
		class={$$props.class}
		style={$$props.style}
	/>
{/if}
