<script lang="ts">
	import type { ToastOptions } from "$stores/toast";
	import Toast from "./Toast.svelte";

	export let messages: ToastOptions[];
</script>

<div
	class="
	fixed bottom-0 left-0
	w-full max-w-sm
	p-2 sm:p-4
	flex flex-col gap-2 sm:gap-4
"
>
	{#each messages as message (message)}
		<Toast {...message} />
	{/each}
</div>
