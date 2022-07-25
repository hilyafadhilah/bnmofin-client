<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import ChevronLeft from "../icons/ChevronLeft.svelte";
	import ChevronRight from "../icons/ChevronRight.svelte";

	export let page: number;
	export let pageSize: number;
	export let totalItems: number;
	export let disabled = false;

	let totalPages: number;
	let currentItem: number;
	let pages: number[];

	$: {
		totalPages = Math.ceil(totalItems / pageSize);
		currentItem = (page - 1) * pageSize + 1;
		pages = [...Array(totalPages).keys()].map((i) => i + 1);
	}

	$: if (totalItems === 0) {
		currentItem = 0;
	}

	const dispatch = createEventDispatcher();
</script>

<div
	class="relative flex flex-wrap justify-center rounded-md overflow-hidden"
	style:row-gap="0.5rem"
>
	{#if disabled}
		<div
			class="w-full h-full absolute bg-slate-300 bg-opacity-50"
			style:z-index="1"
		/>
	{/if}
	<div class="flex items-center ml-4 whitespace-nowrap">
		{currentItem} - {Math.min(currentItem + pageSize - 1, totalItems)}
		of {totalItems}
	</div>
	<div class="border-r-2 border-slate-300 mx-4" />
	<div class="flex items-center">
		<div class="mr-2">Page:</div>
		<select
			style:min-width="58px"
			disabled={totalItems === 0}
			bind:value={page}
			on:change={() => dispatch("change", page)}
		>
			{#each pages as p}
				<option value={p}>{p}</option>
			{/each}
		</select>
	</div>
	<div class="flex items-center ml-2 gap-1">
		<button
			class="icon"
			disabled={page === 1 || totalItems === 0}
			on:click={() => {
				page--;
				dispatch("change", page);
			}}
		>
			<ChevronLeft />
		</button>
		<button
			class="icon"
			disabled={page === totalPages || totalItems === 0}
			on:click={() => {
				page++;
				dispatch("change", page);
			}}
		>
			<ChevronRight />
		</button>
	</div>
</div>
