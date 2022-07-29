<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Home" },
		};
	};
</script>

<script lang="ts">
	import { session } from "$app/stores";
	import Money from "$components/data/Money.svelte";
	import Users from "$components/icons/Users.svelte";
	import Inbox from "$components/icons/Inbox.svelte";
	import { AuthRole } from "$models/auth";
	import SwitchHorizontal from "$components/icons/SwitchHorizontal.svelte";

	const isAdmin = $session.auth?.user.role === AuthRole.Admin;
	const name = isAdmin
		? "@" + $session.auth?.user.username
		: $session.auth?.customer?.fullname;
</script>

<div class="py-6" style="min-height: calc(90vh - 2rem);">
	<h1 class="font-serif">
		Hi, <span class="text-rose-500">{name}</span>! (&gt;_&lt;)
	</h1>
	<hr class="my-4" />
	{#if $session.auth?.customer}
		<div class="mt-4 ml-6">
			<h4>Current Balance</h4>
			<div class="flex">
				<Money amount={$session.auth.customer.balance} class="text-2xl" />
			</div>
		</div>
		<hr class="my-4" />
	{/if}
	<div class="w-fit mt-6 ml-6">
		<h2 class="font-serif">Let's do something today...</h2>
		<div class="mt-4 flex flex-col gap-2 font-serif">
			{#if isAdmin}
				<a
					href="/customers"
					class="clickable-card no-hover-underline p-6 flex items-center gap-4
						bg-sky-50 border-sky-300 text-sky-900"
				>
					<div class="flex items-center">
						<Users class="h-8 w-8 md:h-12 md:w-12" />
					</div>
					<div class="font-semibold text-xl md:text-2xl">
						View & verify Customers
					</div>
				</a>
			{/if}
			<a
				href="/requests"
				class="clickable-card no-hover-underline p-6 flex items-center gap-4
					bg-purple-50 border-purple-300 text-purple-900"
			>
				<div class="flex items-center">
					<Inbox class="h-8 w-8 md:h-12 md:w-12" />
				</div>
				<div class="font-semibold text-xl md:text-2xl">
					{isAdmin
						? "View & accept balance requests"
						: "View requests & make new request"}
				</div>
			</a>
			<a
				href="/transactions"
				class="clickable-card no-hover-underline p-6 flex items-center gap-4
					bg-pink-50 border-pink-300 text-pink-900"
			>
				<div class="flex items-center">
					<SwitchHorizontal class="h-8 w-8 md:h-12 md:w-12" />
				</div>
				<div class="font-semibold text-xl md:text-2xl">
					{isAdmin
						? "View customer transactions"
						: "View transaction history & transfer your money"}
				</div>
			</a>
		</div>
	</div>
</div>
