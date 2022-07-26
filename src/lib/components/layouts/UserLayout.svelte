<script lang="ts">
	import "$root/app.css";
	import Header from "$components/layout/Header.svelte";
	import { browser } from "$app/env";
	import { afterNavigate, goto } from "$app/navigation";
	import { session } from "$app/stores";
	import { toast } from "$stores/toast";
	import { AuthRole } from "$models/auth";
	import { sessionManager } from "$services/session-manager";

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
		class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg"
		style:z-index="99"
	>
		<Header class="h-14" {navigationLinks} />
	</div>

	<main>
		<slot />
	</main>
{/if}
