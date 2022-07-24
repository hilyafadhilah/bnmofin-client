<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Close from "../icons/Close.svelte";

	const dispatch = createEventDispatcher();
</script>

<div
	class="
	bg-white rounded-xl drop-shadow-md
	max-w-xl px-6 py-4 overflow-y-auto {$$props.class}
"
>
	<slot name="header">
		<div class="flex items-end justify-between">
			<div class="ml-2 text-2xl font-bold font-serif">
				<slot name="title" />
			</div>
			<button class="icon" on:click={() => dispatch("close")}>
				<Close />
			</button>
		</div>
	</slot>
	<hr class="my-2" />
	<slot />
	<div class="mt-2 flex items-end justify-end gap-2">
		<slot name="actions" />
	</div>
</div>
