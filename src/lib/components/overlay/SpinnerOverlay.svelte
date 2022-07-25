<script lang="ts">
	import Spin from "../icons/Spin.svelte";
	import { fade } from "svelte/transition";

	export let loading = false;
	let root: HTMLElement | null = null;

	let div: HTMLDivElement;

	$: if (!root && div) {
		root = div.parentElement;
	}

	$: if (loading && root && div) {
		root.style.position = "relative";
		root.style.overflow = "hidden";
		root.classList.add("pointer-events-none");
		root.classList.add("select-none");
	} else if (root) {
		root.style.position = "";
		root.style.overflow = "";
		root.classList.remove("pointer-events-none");
		root.classList.remove("select-none");
	}
</script>

{#if loading}
	<div
		bind:this={div}
		transition:fade={{ duration: 300 }}
		class="
		bg-slate-300 bg-opacity-50
			absolute top-0 left-0 w-full h-full
			pointer-events-none select-none
			flex items-center justify-center
		"
		style:z-index="9"
	>
		<Spin class="text-white h-10 w-10" />
	</div>
{/if}
