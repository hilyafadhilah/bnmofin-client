<!--
	This layout is mixed with many error checking
	because error and default layout cannot be separated
	@see https://github.com/sveltejs/kit/issues/4582#issuecomment-1186037317
-->
<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { firebase } from "$services/firebase";

	export const load: Load = ({ session, error }) => {
		if (!session.auth && !error) {
			return {
				status: 307,
				redirect: "/login",
			};
		}

		firebase.init();

		return {};
	};
</script>

<script lang="ts">
	import "$root/app.css";
	import Head from "$components/Head.svelte";
	import Header from "$components/layout/Header.svelte";
	import { browser } from "$app/env";
	import { afterNavigate, goto } from "$app/navigation";
	import { page, session } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";
	import { AuthRole } from "$models/auth";
	import { sessionManager } from "$services/session-manager";

	$: if (browser && !$session.auth && !$page.error) {
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
		if (from?.host === to.host && from.pathname === "/login") {
			toast.success({
				title: `Welcome ${$session.auth?.user.username}!`,
				message: "You have successfully logged in.",
			});
		} else if (from?.host !== to.host) {
			toast.success({
				title: `Welcome back, ${$session.auth?.user.username}`,
				message: "You are logged in.",
			});
		}
	});
</script>

<Head title={$page.stuff.title} />

{#if $session.auth}
	<div
		class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg"
		style:z-index="99"
	>
		<Header class="h-14" {navigationLinks} />
	</div>
{/if}

<main>
	<slot />
</main>

<ToastContainer toasts={$toast} />
