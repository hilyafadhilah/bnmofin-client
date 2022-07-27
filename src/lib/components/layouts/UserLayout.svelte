<script lang="ts">
	import "$root/app.css";
	import Topbar from "$components/layout/Topbar.svelte";
	import { browser } from "$app/env";
	import { afterNavigate, goto } from "$app/navigation";
	import { session } from "$app/stores";
	import { toast } from "$stores/toast";
	import { AuthRole } from "$models/auth";
	import { sessionManager } from "$services/session-manager";
	import Sidebar from "../layout/Sidebar.svelte";
	import Home from "../icons/Home.svelte";
	import Users from "../icons/Users.svelte";
	import SwitchHorizontal from "../icons/SwitchHorizontal.svelte";
	import Inbox from "../icons/Inbox.svelte";
	import Logout from "../icons/Logout.svelte";

	$: if (browser && !$session.auth) {
		goto("/login");
	}

	let navigationLinks = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/requests", label: "Requests", icon: Inbox },
		{ href: "/transactions", label: "Transactions", icon: SwitchHorizontal },
		{ href: "/logout", label: "Logout", icon: Logout },
	];

	if ($session.auth?.user.role === AuthRole.Admin) {
		navigationLinks.splice(1, 0, {
			href: "/customers",
			label: "Customers",
			icon: Users,
		});
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
	<Topbar class="h-14" auth={$session.auth} links={navigationLinks} />

	<div
		class="flex px-4 md:px-6 lg:px-8 py-4 gap-4 lg:gap-8 items-start"
		style="max-width: 1920px;"
	>
		<Sidebar auth={$session.auth} links={navigationLinks} />

		<main
			class="flex-grow bg-white py-6 px-6 sm:px-6 lg:px-8 overflow-auto rounded-2xl drop-shadow-md"
		>
			<slot />
		</main>
	</div>
{/if}
