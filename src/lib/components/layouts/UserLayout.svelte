<script lang="ts">
	import "$root/app.css";
	import Header from "$components/layout/Header.svelte";
	import { browser } from "$app/env";
	import { afterNavigate, goto } from "$app/navigation";
	import { session } from "$app/stores";
	import { toast } from "$stores/toast";
	import { AuthRole } from "$models/auth";
	import { sessionManager } from "$services/session-manager";
	import bnmo from "$root/assets/images/bnmo.png";
	import ChevronLeft from "../icons/ChevronLeft.svelte";

	$: if (browser && !$session.auth) {
		goto("/login");
	}

	let navigationLinks = [
		{ href: "/", label: "Home" },
		{ href: "/requests", label: "Requests" },
		{ href: "/transactions", label: "Transactions" },
		{ href: "/logout", label: "Logout" },
	];

	if ($session.auth?.user.role === AuthRole.Admin) {
		navigationLinks.splice(1, 0, { href: "/customers", label: "Customers" });
		navigationLinks = navigationLinks;
	}

	afterNavigate(() => {
		sessionManager.refresh(session, $session).catch(toast.forwardError);
	});

	afterNavigate(({ from, to }) => {
		if (from?.host !== to.host && $session.auth) {
			toast.success({
				title: `Welcome back, ${$session.auth?.user.username}`,
				message: "You are logged in.",
			});
		}
	});
</script>

{#if $session.auth}
	<div
		class="sticky md:hidden top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg"
		style:z-index="99"
	>
		<Header class="h-14" {navigationLinks} />
	</div>

	<div
		class="flex px-4 md:px-6 lg:px-8 py-4 gap-4 lg:gap-8 items-start"
		style="max-width: 1920px;"
	>
		<header class="hidden md:block sticky top-4" style=" max-width: 16rem;">
			<div class="bg-white flex flex-col rounded-xl px-4 py-2 drop-shadow-md">
				<div class="mt-2">
					<img src={bnmo} alt="BNMO" class="h-28 mx-auto" />
				</div>
				<div class="whitespace-nowrap">
					<h3 class="font-serif text-center">BNMO wAllet</h3>
				</div>
				<hr class="my-2" />
				<div class="text-center">
					<div class="text-lg font-bold">
						@{$session.auth.user.username}
					</div>
					<div class="text-sm">
						{#if $session.auth.user.role === AuthRole.Admin}
							Admin
						{:else if $session.auth.customer}
							{$session.auth.customer.fullname}
						{/if}
					</div>
				</div>
				<hr class="my-2" />
				<nav class="flex flex-col px-2 py-4 gap-2 text-lg">
					{#each navigationLinks as link}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
				<hr class="my-2" />
				<div>
					<!-- TODO: collapse sidebar -->
					<button class="icon">
						<ChevronLeft />
					</button>
				</div>
			</div>
		</header>

		<main
			class="flex-grow bg-white py-6 px-6 sm:px-6 lg:px-8 overflow-auto rounded-2xl drop-shadow-md"
		>
			<slot />
		</main>
	</div>
{/if}
