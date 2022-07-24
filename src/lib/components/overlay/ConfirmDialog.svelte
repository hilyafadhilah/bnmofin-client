<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Dialog from "./Dialog.svelte";
	import Overlay from "./Overlay.svelte";
	import SpinnerOverlay from "./SpinnerOverlay.svelte";

	export let isOpen = false;
	export let loading = false;

	const dispatch = createEventDispatcher();
</script>

<Overlay
	class="flex items-center justify-center"
	bind:isOpen
	persistent
	duration={200}
>
	<Dialog class="w-full max-w-lg mb-24" on:close={() => (isOpen = false)}>
		<SpinnerOverlay {loading} />

		<svelte:fragment slot="title">Are you sure?</svelte:fragment>

		<div class="my-6">
			<slot />
		</div>

		<svelte:fragment slot="actions">
			<button class="primary variant-outline" on:click={() => (isOpen = false)}
				>Cancel</button
			>
			<button class="primary" on:click={() => dispatch("confirm")}>Yes</button>
		</svelte:fragment>
	</Dialog>
</Overlay>
