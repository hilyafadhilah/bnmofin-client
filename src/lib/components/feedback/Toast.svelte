<script lang="ts">
	import { fastSlide } from "$lib/transitions/fast-slide";
	import type { ComponentType } from "svelte";

	export let message: string;
	export let title = "";
	export let type: "primary" | "error" | "success" = "primary";
	export let variant: "solid" | "outline" = "solid";
	export let icon: ComponentType | null = null;
</script>

<div
	in:fastSlide={{ axis: "X", direction: "-" }}
	out:fastSlide={{ axis: "Y", direction: "-", duration: 500 }}
	class="w-full px-4 py-2 border-2
		rounded-md drop-shadow-md
		break-words {type} {variant}"
	style:z-index="999"
	style:min-height="96px"
	style:white-space="normal"
>
	{#if title}
		<h5 class="font-serif">{title}</h5>
	{/if}
	<div>
		{message}
	</div>
</div>

<style lang="postcss">
	.solid {
		@apply text-white bg-rose-500 border-rose-500;
	}
	.solid.error {
		@apply bg-red-500 border-red-500;
	}
	.solid.success {
		@apply bg-emerald-500 border-emerald-500;
	}
	.outline {
		@apply bg-white text-rose-500 border-rose-500;
	}
	.outline.error {
		@apply text-emerald-500 border-emerald-500;
	}
	.outline.success {
		@apply text-red-500 border-red-500;
	}
</style>
