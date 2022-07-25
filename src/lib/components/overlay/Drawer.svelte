<script lang="ts">
	import { directedSlide } from "$transitions/directed-slide";

	export let from: "top" | "bottom" | "right" | "left" = "top";
	export let isOpen = false;
	export let size = "324px";
	export let duration = 500;

	const axis = from === "top" || from === "bottom" ? "y" : "x";
	const prop = axis === "y" ? "max-height" : "max-width";
</script>

{#if isOpen}
	<div
		transition:directedSlide={{ axis, duration }}
		class="drawer-box absolute w-full h-full bg-white"
		style="{prop}:{size};{from}:0;"
	>
		<slot />
	</div>
{/if}
