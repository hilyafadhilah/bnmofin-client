<script lang="ts">
	import Burger from "$lib/components/icons/Burger.svelte";
	import Close from "$lib/components/icons/Close.svelte";
	import Drawer from "$lib/components/overlay/Drawer.svelte";
	import { browser } from "$app/env";

	type NavigationLink = { label: string; href: string };
	export let navigationLinks = [] as NavigationLink[];

	let isOpen = false;
	const duration = 500;

	$: if (browser) {
		if (isOpen) {
			document.body.classList.add("overflow-y-hidden");
		} else {
			setTimeout(() => {
				document.body.classList.remove("overflow-y-hidden");
			}, duration);
		}
	}
</script>

<svelte:body class="bg-black" />

<header class="flex items-center {$$props.class}">
	<div class="w-full px-2 flex flex-row items-center">
		<div class="h-8 sm:h-10">
			<img src="/bnmo.png" alt="BNMO" class="h-full w-auto" />
		</div>
		<div class="w-full flex items-center">
			<div class="flex flex-col ml-2 font-serif">
				<div class="text-2xl sm:text-4xl">bNM0 wAllet</div>
			</div>
			<nav class="hidden md:flex justify-end gap-4 flex-grow pr-4">
				{#each navigationLinks as { label, href }}
					<a {href}>{label}</a>
				{/each}
			</nav>
			<div class="md:hidden flex justify-end flex-grow">
				<button
					class="icon"
					on:click={() => {
						isOpen = true;
					}}
				>
					<Burger />
				</button>
			</div>
		</div>
	</div>
</header>

<Drawer bind:isOpen from="right" {duration}>
	<div class="flex flex-col p-2">
		<div class="self-end mb-2">
			<button
				class="icon text-teal-900"
				on:click={() => {
					isOpen = false;
				}}
			>
				<Close />
			</button>
		</div>
		<nav class="flex flex-col gap-2 px-2">
			{#each navigationLinks as { label, href }}
				<a {href} class="text-lg">{label}</a>
			{/each}
		</nav>
	</div>
</Drawer>
