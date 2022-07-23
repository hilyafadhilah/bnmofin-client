<script lang="ts">
	import "$root/app.css";
	import Head from "$lib/components/Head.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import { auth } from "$lib/stores/auth";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { firebase } from "$lib/services/firebase";
	import { page } from "$app/stores";

	firebase.init();

	let loading = browser;
	$: loading = $auth === undefined;

	$: if (browser && $auth === null) {
		goto("/login");
	}

	let navigationLinks = [
		{ href: "/", label: "Home" },
		{ href: "/requests", label: "Requests" },
		{ href: "/transactions", label: "Transactions" },
		{ href: "/logout", label: "Logout" },
	];

	$: if ($auth?.user.role === "Admin") {
		navigationLinks.splice(1, 0, { href: "/customers", label: "Customers" });
		navigationLinks = navigationLinks;
	}
</script>

<Head title={$page.stuff.title} />

<div class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg">
	<Header class="h-14" {navigationLinks} />
</div>

<main>
	{#if loading}
		Loading...
	{:else}
		<slot />
	{/if}
</main>
