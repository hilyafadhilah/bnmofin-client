<script lang="ts">
	import Burger from "$components/icons/Burger.svelte";
	import Close from "$components/icons/Close.svelte";
	import Drawer from "$components/overlay/Drawer.svelte";
	import bnmo from "$root/assets/images/bnmo.png";
	import { browser } from "$app/env";
	import Overlay from "$components/overlay/Overlay.svelte";
	import type { ComponentType } from "svelte";
	import { AuthRole, type Auth } from "$models/auth";
	import { moneyFormat } from "$utils/data";
	import { isInRoute } from "$utils/component";
	import { page } from "$app/stores";

	export let auth: Auth;
	export let links: Array<{ href: string; label: string; icon: ComponentType }>;

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

	let screenW: number;
	$: if (screenW >= 768) {
		isOpen = false;
	}
</script>

<svelte:window bind:innerWidth={screenW} />

<header
	style:z-index="99"
	class="md:hidden sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg flex items-center {$$props.class}"
>
	<div class="w-full px-2 flex flex-row items-center">
		<a
			href="/"
			class="no-hover-underline flex rounded-md focus:outline-rose-500"
		>
			<div class="h-full">
				<img src={bnmo} alt="BNMO" class="h-8 sm:h-10 w-auto" />
			</div>
			<div class="flex flex-col ml-2 font-serif">
				<div class="text-2xl sm:text-4xl">bNM0 wAllet</div>
			</div>
		</a>
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
</header>

<Overlay bind:isOpen {duration}>
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
			<div class="px-2 overflow-x-clip">
				<div class="text-2xl font-semibold">
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
						class="px-2 mt-2 rounded-sm whitespace-nowrap text-right text-lg font-mono text-white {auth
							.customer.balance > 0
							? 'bg-emerald-500'
							: 'bg-rose-500'}"
					>
						{moneyFormat(auth.customer.balance)}
					</div>
				{/if}
			</div>
			<hr class="my-4" />
			<nav class="flex flex-col px-2 gap-2 text-lg">
				{#each links as { href, icon, label }}
					<a
						{href}
						class="
							p-1 rounded-md flex gap-2 hover:bg-slate-200 focus:outline-teal-500
							{isInRoute($page.url.pathname, href) ? 'text-rose-500' : 'text-slate-800'}
						"
						aria-current={isInRoute($page.url.pathname, href)
							? "page"
							: "false"}
						on:click={() => (isOpen = false)}
					>
						<span>
							<svelte:component this={icon} class="h-7 w-7" />
						</span>
						<span>{label}</span>
					</a>
				{/each}
			</nav>
		</div>
	</Drawer>
</Overlay>
