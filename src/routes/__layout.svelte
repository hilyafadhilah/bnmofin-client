<script lang="ts" context="module">
	import { routeGuard } from "$services/route-guard";

	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session, url }) => {
		const role = routeGuard.getRole(session);
		if (!routeGuard.isAuthorized(role, url.pathname)) {
			return {
				status: 307,
				redirect: routeGuard.redirects[role],
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import "$root/app.css";
	import { page, session } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";
	import { firebase } from "$services/firebase";
	import UserLayout from "$components/layouts/UserLayout.svelte";
	import GuestLayout from "$components/layouts/GuestLayout.svelte";
	import { browser } from "$app/env";
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
	import Overlay from "$components/overlay/Overlay.svelte";
	import Spin from "$components/icons/Spin.svelte";

	firebase.init();

	$: if (browser) {
		const role = routeGuard.getRole($session);
		if (!routeGuard.isAuthorized(role, $page.url.pathname)) {
			goto(routeGuard.redirects[role]);
		}
	}

	let loading = false;

	beforeNavigate(({ from, to }) => (loading = from.host === to?.host));
	afterNavigate(() => (loading = false));
</script>

<svelte:head>
	<title
		>{$page.stuff.title?.length ? `${$page.stuff.title} | ` : ""}BNMO Wallet</title
	>
</svelte:head>

{#if $page.error}
	<slot />
{:else if $session.auth?.user}
	<UserLayout>
		<slot />
	</UserLayout>
{:else}
	<GuestLayout>
		<slot />
	</GuestLayout>
{/if}

<Overlay isOpen={loading} persistent class="flex items-center justify-center">
	<Spin class="text-white h-16 w-16" />
</Overlay>

<ToastContainer toasts={$toast} />
