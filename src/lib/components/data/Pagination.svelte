<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import ChevronLeft from "../icons/ChevronLeft.svelte";
	import ChevronRight from "../icons/ChevronRight.svelte";

	export let page: number;
	export let pageSize: number;
	export let totalItems: number;

	const totalPages = Math.ceil(totalItems / pageSize);
	const currentItem = (page - 1) * pageSize + 1;
	const pages = [...Array(totalPages).keys()].map((i) => i + 1);

	const dispatch = createEventDispatcher();
</script>

<div class="flex">
	<div class="flex items-center">
		{currentItem} - {Math.min(currentItem + pageSize - 1, totalItems)}
		of {totalItems}
	</div>
	<div class="border-r-2 border-slate-300 mx-4" />
	<div class="flex items-center">
		<div class="mr-2">Page:</div>
		<select bind:value={page} on:change={() => dispatch("change", page)}>
			{#each pages as p}
				<option value={p}>{p}</option>
			{/each}
		</select>
	</div>
	<div class="flex items-center ml-2 gap-1">
		<button
			class="icon"
			disabled={page === 1}
			on:click={() => {
				page--;
				dispatch("change", page);
			}}
		>
			<ChevronLeft />
		</button>
		<button
			class="icon"
			disabled={page === totalPages}
			on:click={() => {
				page++;
				dispatch("change", page);
			}}
		>
			<ChevronRight />
		</button>
	</div>
</div>
