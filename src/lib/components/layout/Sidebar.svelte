<script lang="ts">
	import ChevronLeft from "../icons/ChevronLeft.svelte";
	import bnmo from "$root/assets/images/bnmo.png";
	import { AuthRole, type Auth } from "$models/auth";
	import ChevronRight from "../icons/ChevronRight.svelte";
	import type { ComponentType } from "svelte";
	import { moneyFormat } from "$utils/data";
	import { isInRoute } from "$utils/component";
	import { page } from "$app/stores";

	export let auth: Auth;
	export let links: Array<{ href: string; label: string; icon: ComponentType }>;

	export let expanded = true;
	let maxWidth: string;
	$: maxWidth = expanded ? "16rem" : "6rem";

	let screenW: number;
	$: expanded = screenW >= 888 || screenW == null;
</script>

<svelte:window bind:innerWidth={screenW} />

<header
	class="hidden md:block sticky top-4 transition-all"
	style=" max-width: {maxWidth};"
>
	<div class="bg-white flex flex-col rounded-xl px-4 py-2 drop-shadow-md">
		<div class="h-28 mt-2">
			<img src={bnmo} alt="BNMO" class="h-full w-full object-contain mx-auto" />
		</div>
		<div class="whitespace-nowrap font-serif text-center">
			{#if expanded}
				<h3>bNM0 wAllet</h3>
			{:else}
				<h5>bNM0</h5>
			{/if}
		</div>
		<hr class="my-2" />
		<div class="text-center overflow-x-clip">
			<div class="text-lg font-semibold">
				@{auth.user.username}
			</div>
			<div class="text-sm whitespace-nowrap">
				{#if auth.user.role === AuthRole.Admin}
					Admin
				{:else if auth.customer}
					{auth.customer.fullname}
				{/if}
			</div>
			{#if auth.customer}
				<div
					class="px-2 mt-2 rounded-sm whitespace-nowrap font-mono text-white {auth
						.customer.balance > 0
						? 'bg-emerald-600'
						: 'bg-rose-500'}"
				>
					{moneyFormat(auth.customer.balance)}
				</div>
			{/if}
		</div>
		<hr class="my-2" />
		<nav class="flex flex-col px-2 py-4 gap-2 text-lg">
			{#each links as { href, icon, label }}
				<a
					{href}
					class:justify-center={!expanded}
					class="
						p-1 rounded-md flex gap-2 hover:bg-slate-200 focus:outline-teal-500
						{isInRoute($page.url.pathname, href) ? 'text-rose-500' : 'text-slate-800'}
					"
					aria-current={isInRoute($page.url.pathname, href) ? "page" : "false"}
				>
					<span>
						<svelte:component this={icon} class="h-7 w-7" />
					</span>
					{#if expanded}
						<span>{label}</span>
					{/if}
				</a>
			{/each}
		</nav>
		<hr class="my-2" />
		<div class="flex" class:justify-center={!expanded}>
			<button class="icon" on:click={() => (expanded = !expanded)}>
				<svelte:component this={expanded ? ChevronLeft : ChevronRight} />
			</button>
		</div>
	</div>
</header>
