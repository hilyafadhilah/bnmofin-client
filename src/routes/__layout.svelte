<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { firebase } from "$lib/services/firebase";

	export const load: Load = ({ session }) => {
		if (!session.auth) {
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
	import Head from "$lib/components/Head.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { page, session } from "$app/stores";

	$: if (browser && !$session.auth) {
		goto("/login");
	}

	let navigationLinks = [
		{ href: "/", label: "Home" },
		{ href: "/requests", label: "Requests" },
		{ href: "/transactions", label: "Transactions" },
		{ href: "/logout", label: "Logout" },
	];

	$: if ($session.auth?.user.role === "Admin") {
		navigationLinks.splice(1, 0, { href: "/customers", label: "Customers" });
		navigationLinks = navigationLinks;
	}
</script>

<Head title={$page.stuff.title} />

<div class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg">
	<Header class="h-14" {navigationLinks} />
</div>

<main>
	<slot />
</main>
